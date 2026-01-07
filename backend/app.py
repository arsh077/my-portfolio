from flask import Flask, render_template, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import db, AdminUser, ContactSubmission
from routes import api
import os

def create_app():
    """Application factory pattern"""
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    db.init_app(app)
    jwt = JWTManager(app)
    
    # Configure CORS
    CORS(app, origins=app.config['CORS_ORIGINS'])
    
    # Register blueprints
    app.register_blueprint(api)
    
    # Create database tables and default admin user
    with app.app_context():
        db.create_all()
        create_default_admin()
    
    return app

def create_default_admin():
    """Create default admin user if none exists"""
    try:
        if not AdminUser.query.first():
            admin = AdminUser(
                username=Config.ADMIN_USERNAME,
                email=Config.ADMIN_EMAIL
            )
            admin.set_password(Config.ADMIN_PASSWORD)
            
            db.session.add(admin)
            db.session.commit()
            
            print(f"✅ Default admin user created:")
            print(f"   Username: {Config.ADMIN_USERNAME}")
            print(f"   Password: {Config.ADMIN_PASSWORD}")
            print(f"   ⚠️  IMPORTANT: Change these credentials in production!")
        else:
            print("✅ Admin user already exists")
            
    except Exception as e:
        print(f"❌ Error creating default admin: {e}")
        db.session.rollback()

# Create Flask app
app = create_app()

# Admin panel routes
@app.route('/admin')
def admin_panel():
    """Admin panel main page"""
    return render_template('admin_dashboard.html')

@app.route('/admin/login')
def admin_login_page():
    """Admin login page"""
    return render_template('admin_login.html')

# Health check endpoint
@app.route('/health')
def health_check():
    """Health check endpoint"""
    return {
        'status': 'healthy',
        'message': 'Arshad Anwar Portfolio Backend API',
        'version': '1.0.0'
    }

# API documentation endpoint
@app.route('/api/docs')
def api_docs():
    """API documentation"""
    docs = {
        'title': 'Arshad Anwar Portfolio API',
        'version': '1.0.0',
        'description': 'Backend API for portfolio contact form and admin panel',
        'endpoints': {
            'contact_form': {
                'url': '/api/submit-contact',
                'method': 'POST',
                'description': 'Submit contact form',
                'body': {
                    'name': 'string (required)',
                    'email': 'string (required)',
                    'service': 'string (required)',
                    'message': 'string (required, min 10 chars)'
                }
            },
            'admin_login': {
                'url': '/api/admin/login',
                'method': 'POST',
                'description': 'Admin login',
                'body': {
                    'username': 'string (required)',
                    'password': 'string (required)'
                }
            },
            'get_submissions': {
                'url': '/api/admin/submissions',
                'method': 'GET',
                'description': 'Get contact submissions (Admin only)',
                'headers': {
                    'Authorization': 'Bearer <token>'
                },
                'query_params': {
                    'page': 'int (optional, default: 1)',
                    'per_page': 'int (optional, default: 20)',
                    'is_read': 'boolean (optional)'
                }
            },
            'admin_stats': {
                'url': '/api/admin/stats',
                'method': 'GET',
                'description': 'Get admin dashboard statistics',
                'headers': {
                    'Authorization': 'Bearer <token>'
                }
            }
        }
    }
    return docs

if __name__ == '__main__':
    import os
    print("🚀 Starting Arshad Anwar Portfolio Backend...")
    print("📧 Contact Form API: http://localhost:5000/api/submit-contact")
    print("🔐 Admin Panel: http://localhost:5000/admin")
    print("📚 API Docs: http://localhost:5000/api/docs")
    print("❤️  Health Check: http://localhost:5000/health")
    print("-" * 50)
    
    # Use PORT environment variable for production (Heroku)
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') != 'production'
    
    app.run(debug=debug, host='0.0.0.0', port=port)