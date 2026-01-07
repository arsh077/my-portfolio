from flask import Blueprint, request, jsonify, render_template
from flask_jwt_extended import create_access_token, jwt_required
from datetime import datetime
from models import db, ContactSubmission, AdminUser
from auth import admin_required, validate_admin_credentials, get_current_admin
import re
from email_validator import validate_email, EmailNotValidError

# Create Blueprint
api = Blueprint('api', __name__)

# Email validation regex
EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')

@api.route('/api/submit-contact', methods=['POST'])
def submit_contact():
    """Handle contact form submissions"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'service', 'message']
        for field in required_fields:
            if not data.get(field) or not data[field].strip():
                return jsonify({
                    'success': False,
                    'error': f'{field.capitalize()} is required'
                }), 400
        
        # Validate email format
        email = data['email'].strip().lower()
        try:
            validate_email(email)
        except EmailNotValidError:
            return jsonify({
                'success': False,
                'error': 'Invalid email format'
            }), 400
        
        # Validate message length
        if len(data['message'].strip()) < 10:
            return jsonify({
                'success': False,
                'error': 'Message must be at least 10 characters long'
            }), 400
        
        # Get client IP address
        client_ip = request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr)
        
        # Create new submission
        submission = ContactSubmission(
            name=data['name'].strip(),
            email=email,
            service=data['service'].strip(),
            message=data['message'].strip(),
            ip_address=client_ip
        )
        
        # Save to database
        db.session.add(submission)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Thank you for your message! We will get back to you soon.',
            'id': submission.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': 'An error occurred while processing your request'
        }), 500

@api.route('/api/admin/login', methods=['POST'])
def admin_login():
    """Admin login endpoint"""
    try:
        data = request.get_json()
        
        username = data.get('username', '').strip()
        password = data.get('password', '')
        
        if not username or not password:
            return jsonify({
                'success': False,
                'error': 'Username and password are required'
            }), 400
        
        # Validate credentials
        admin = validate_admin_credentials(username, password)
        if not admin:
            return jsonify({
                'success': False,
                'error': 'Invalid username or password'
            }), 401
        
        # Update last login
        admin.last_login = datetime.utcnow()
        db.session.commit()
        
        # Create JWT token
        access_token = create_access_token(identity=admin.id)
        
        return jsonify({
            'success': True,
            'token': access_token,
            'admin': admin.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': 'Login failed'
        }), 500

@api.route('/api/admin/submissions', methods=['GET'])
@admin_required
def get_submissions():
    """Get all contact form submissions (Admin only)"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        is_read = request.args.get('is_read', type=bool)
        
        # Build query
        query = ContactSubmission.query
        
        # Filter by read status if specified
        if is_read is not None:
            query = query.filter_by(is_read=is_read)
        
        # Order by newest first
        query = query.order_by(ContactSubmission.submitted_at.desc())
        
        # Paginate
        submissions = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        return jsonify({
            'success': True,
            'submissions': [sub.to_dict() for sub in submissions.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': submissions.total,
                'pages': submissions.pages,
                'has_next': submissions.has_next,
                'has_prev': submissions.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': 'Failed to fetch submissions'
        }), 500

@api.route('/api/admin/submissions/<int:submission_id>', methods=['GET'])
@admin_required
def get_submission(submission_id):
    """Get specific submission by ID (Admin only)"""
    try:
        submission = ContactSubmission.query.get_or_404(submission_id)
        
        # Mark as read
        if not submission.is_read:
            submission.is_read = True
            db.session.commit()
        
        return jsonify({
            'success': True,
            'submission': submission.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': 'Submission not found'
        }), 404

@api.route('/api/admin/submissions/<int:submission_id>', methods=['DELETE'])
@admin_required
def delete_submission(submission_id):
    """Delete specific submission (Admin only)"""
    try:
        submission = ContactSubmission.query.get_or_404(submission_id)
        
        db.session.delete(submission)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Submission deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': 'Failed to delete submission'
        }), 500

@api.route('/api/admin/submissions/<int:submission_id>/mark-read', methods=['PATCH'])
@admin_required
def mark_submission_read(submission_id):
    """Mark submission as read/unread (Admin only)"""
    try:
        submission = ContactSubmission.query.get_or_404(submission_id)
        data = request.get_json()
        
        submission.is_read = data.get('is_read', True)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'submission': submission.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': 'Failed to update submission'
        }), 500

@api.route('/api/admin/stats', methods=['GET'])
@admin_required
def get_admin_stats():
    """Get admin dashboard statistics"""
    try:
        total_submissions = ContactSubmission.query.count()
        unread_submissions = ContactSubmission.query.filter_by(is_read=False).count()
        
        # Recent submissions (last 7 days)
        from datetime import timedelta
        week_ago = datetime.utcnow() - timedelta(days=7)
        recent_submissions = ContactSubmission.query.filter(
            ContactSubmission.submitted_at >= week_ago
        ).count()
        
        # Service breakdown
        services = db.session.query(
            ContactSubmission.service,
            db.func.count(ContactSubmission.id).label('count')
        ).group_by(ContactSubmission.service).all()
        
        service_stats = [{'service': s[0], 'count': s[1]} for s in services]
        
        return jsonify({
            'success': True,
            'stats': {
                'total_submissions': total_submissions,
                'unread_submissions': unread_submissions,
                'recent_submissions': recent_submissions,
                'service_breakdown': service_stats
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': 'Failed to fetch statistics'
        }), 500

@api.route('/api/admin/profile', methods=['GET'])
@admin_required
def get_admin_profile():
    """Get current admin profile"""
    try:
        admin = get_current_admin()
        return jsonify({
            'success': True,
            'admin': admin.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': 'Failed to fetch profile'
        }), 500