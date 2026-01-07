# 🚀 Backend Setup Guide - Flask Contact Form + Admin Panel

## 📁 Project Structure

```
backend/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── config.py             # Configuration settings
├── models.py             # Database models
├── routes.py             # API routes
├── auth.py              # Authentication logic
└── templates/
    ├── admin_login.html  # Admin login page
    └── admin_dashboard.html # Admin dashboard
```

## 🔧 Installation & Setup

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Initialize Database

```bash
python app.py
# Database will auto-create on first run
```

### 3. Run Server

```bash
python app.py
```

Server runs on **http://localhost:5000**

## 🌐 API Endpoints

### Contact Form
- **POST** `/api/submit-contact`
- **Body**: `{name, email, service, message}`
- **Response**: `{success: true, id: submission_id}`

### Admin Login
- **POST** `/api/admin/login`
- **Body**: `{username, password}`
- **Response**: `{token: jwt_token}`

### Get Submissions (Admin Only)
- **GET** `/api/admin/submissions`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: `{submissions: [...]}`

### Delete Submission (Admin Only)
- **DELETE** `/api/admin/submissions/{id}`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: `{success: true}`

## 🔐 Default Admin Credentials

**⚠️ IMPORTANT: Change these in production!**

- **Username**: `admin`
- **Password**: `admin123`

## 🎯 Frontend Integration

Your portfolio contact form now automatically connects to the backend:

### Contact Form Submission
```javascript
// Already integrated in your App.tsx
const response = await fetch('http://localhost:5000/api/submit-contact', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        name: formData.get('name'),
        email: formData.get('email'),
        service: formData.get('service'),
        message: formData.get('message')
    })
});
```

### Admin Panel Access
- **Login Page**: http://localhost:5000/admin/login
- **Dashboard**: http://localhost:5000/admin
- **Admin Button**: Added to your portfolio header

## 🔒 Security Features

### Authentication
- JWT-based admin authentication
- Password hashing with bcrypt
- Session management
- Auto-logout on token expiry

### Data Protection
- Input validation and sanitization
- Email format validation
- SQL injection prevention
- XSS protection
- CORS configuration

### Rate Limiting (Recommended)
Add rate limiting in production:
```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

@app.route('/api/submit-contact', methods=['POST'])
@limiter.limit("5 per minute")
def submit_contact():
    # ... existing code
```

## 📊 Admin Dashboard Features

### Statistics Dashboard
- Total submissions count
- Unread submissions
- Recent submissions (last 7 days)
- Service breakdown

### Submission Management
- View all submissions
- Filter by read/unread status
- Mark as read/unread
- Delete submissions
- Detailed submission view

### Real-time Updates
- Auto-refresh every 30 seconds
- Live statistics
- Instant status updates

## 🌐 Production Deployment

### Environment Variables
Create a `.env` file:
```env
DATABASE_URL=postgresql://user:pass@localhost/portfolio
JWT_SECRET_KEY=your-super-secret-key-here
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password
ADMIN_EMAIL=admin@yourdomain.com
```

### Security Checklist
- [ ] Change default admin credentials
- [ ] Use strong JWT secret key
- [ ] Enable HTTPS in production
- [ ] Set up proper CORS origins
- [ ] Implement rate limiting
- [ ] Use environment variables
- [ ] Set up database backups
- [ ] Monitor logs and errors

### Deployment Options

#### 1. Heroku
```bash
# Install Heroku CLI
heroku create your-portfolio-backend
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

#### 2. DigitalOcean App Platform
```yaml
# app.yaml
name: portfolio-backend
services:
- name: api
  source_dir: backend
  github:
    repo: your-username/your-repo
    branch: main
  run_command: python app.py
  environment_slug: python
  instance_count: 1
  instance_size_slug: basic-xxs
```

#### 3. Railway
```bash
# Install Railway CLI
railway login
railway init
railway add postgresql
railway deploy
```

## 🔧 Configuration

### CORS Settings
Update `config.py` for production:
```python
CORS_ORIGINS = [
    'https://yourdomain.com',
    'https://www.yourdomain.com'
]
```

### Database Configuration
For production, use PostgreSQL:
```python
SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'postgresql://user:pass@localhost/portfolio'
```

## 📱 Mobile Admin Access

The admin dashboard is fully responsive and works perfectly on mobile devices:
- Touch-friendly interface
- Responsive tables
- Mobile-optimized forms
- Swipe gestures support

## 🚨 Troubleshooting

### Common Issues

**1. CORS Errors**
- Check `CORS_ORIGINS` in `config.py`
- Ensure frontend URL is included

**2. Database Connection**
- Verify database URL in config
- Check database permissions

**3. JWT Token Issues**
- Clear browser localStorage
- Check token expiry settings

**4. Form Submission Fails**
- Verify backend server is running
- Check network connectivity
- Review browser console for errors

## 📞 Support

Your backend is now fully integrated with your portfolio:

### ✅ What's Working
- Contact form submissions
- Admin authentication
- Submission management
- Real-time dashboard
- Mobile-responsive admin panel

### 🎯 Next Steps
1. Test the contact form on your portfolio
2. Access admin panel at http://localhost:5000/admin/login
3. Review submissions in the dashboard
4. Deploy to production when ready

**Your portfolio now has a complete backend system! 🎉**