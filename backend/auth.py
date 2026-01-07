from functools import wraps
from flask import request, jsonify, current_app
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from models import AdminUser

def admin_required(f):
    """Decorator to require admin authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            verify_jwt_in_request()
            current_user_id = get_jwt_identity()
            
            # Check if user exists and is active
            admin = AdminUser.query.get(current_user_id)
            if not admin or not admin.is_active:
                return jsonify({'error': 'Invalid or inactive admin user'}), 401
                
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({'error': 'Authentication required'}), 401
    
    return decorated_function

def get_current_admin():
    """Get current authenticated admin user"""
    try:
        verify_jwt_in_request()
        current_user_id = get_jwt_identity()
        return AdminUser.query.get(current_user_id)
    except:
        return None

def validate_admin_credentials(username, password):
    """Validate admin login credentials"""
    admin = AdminUser.query.filter_by(username=username, is_active=True).first()
    if admin and admin.check_password(password):
        return admin
    return None