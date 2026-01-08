# 🌟 Arshad Anwar - Professional Portfolio & Backend System

A modern, full-stack portfolio website with integrated contact form management system. Built with React, TypeScript, Tailwind CSS, and Flask.

![Portfolio Preview](https://img.shields.io/badge/Status-Live-brightgreen)
![React](https://img.shields.io/badge/React-19.2.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue)
![Flask](https://img.shields.io/badge/Flask-2.3.3-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.19-blue)

## 🎯 Overview

Professional portfolio website for **Arshad Anwar**, Founder of Legal Success India, showcasing expertise in legal-tech solutions and full-stack development. Features a complete backend system for contact form management and admin panel.

### ✨ Key Features

- **🎨 Modern Design**: Clean, responsive design with dark/light mode
- **📱 Mobile-First**: Optimized for all devices and screen sizes
- **⚡ Performance**: Fast loading with Vite and optimized assets
- **🔒 Secure Backend**: JWT authentication and input validation
- **📊 Admin Dashboard**: Real-time submission management
- **🌐 SEO Optimized**: Meta tags, sitemap, and structured data

## 🚀 Live Projects Showcase

- **[Legal Success India](https://legalsuccessindia.com/)** - Comprehensive legal-tech platform
- **[Khurak Application](https://khurak-new-application.vercel.app/)** - Modern food delivery app
- **[Legal Success India v2](https://legal-success-indiaa-new-work-azf3.vercel.app/)** - Enhanced legal platform
- **[Modern Web Application](https://695f8e9cf76af1feafbe803a--graceful-gecko-58ed9c.netlify.app/)** - Cutting-edge web application with modern UI

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React with modern features
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server
- **Lucide React** - Beautiful, customizable icons

### Backend
- **Flask** - Python web framework
- **SQLAlchemy** - Database ORM
- **JWT** - JSON Web Token authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**
- **pip** (Python package manager)

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/arshad-anwar-portfolio.git
cd arshad-anwar-portfolio
```

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
Frontend runs on **http://localhost:5173/**

### 3. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start Flask server
python app.py
```
Backend runs on **http://localhost:5000/**

### 4. Access Admin Panel
- **Admin Login**: http://localhost:5000/admin/login
- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change default credentials in production!

## 📁 Project Structure

```
portfolio-website/
├── App.tsx              # Main React component
├── index.tsx           # Application entry point
├── index.html          # HTML template
├── package.json        # Frontend dependencies
├── tailwind.config.js  # Tailwind configuration
├── backend/
│   ├── app.py              # Flask application
│   ├── models.py           # Database models
│   ├── routes.py           # API routes
│   ├── auth.py             # Authentication logic
│   ├── config.py           # Configuration settings
│   ├── requirements.txt    # Python dependencies
│   └── templates/          # HTML templates
├── public/                 # Static assets
└── docs/                   # Documentation
```

## 🎨 Features Overview

### 🏠 Portfolio Sections

1. **Hero Section** - Animated name with professional photo
2. **About Section** - Personal introduction and skills
3. **Portfolio Section** - Live project links with descriptions
4. **Services Section** - Web development and legal-tech services
5. **Testimonials** - Client feedback and references
6. **Contact Section** - Working contact form with backend integration

### 🔧 Backend Features

1. **Contact Form API** - Form submission handling with validation
2. **Admin Authentication** - JWT-based secure login system
3. **Admin Dashboard** - Real-time statistics and submission management
4. **Database Management** - Contact submissions and admin user storage

## 🌐 API Documentation

### Contact Form Submission
```http
POST /api/submit-contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "service": "Custom Website Development",
  "message": "I need a professional website..."
}
```

### Admin Login
```http
POST /api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

## 🔒 Security Features

- **Input Validation**: Server-side validation for all inputs
- **Password Hashing**: bcrypt for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **CORS Protection**: Configured for specific origins
- **SQL Injection Prevention**: Parameterized queries

## 🚀 Deployment

### Frontend Deployment (Vercel)
```bash
npm run build
# Deploy to Vercel, Netlify, or any static hosting
```

### Backend Deployment (Heroku)
```bash
# Create Heroku app
heroku create your-portfolio-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Deploy
git push heroku main
```

## 👨‍💻 About Arshad Anwar

**Founder & Full-Stack Developer at Legal Success India**

Specializing in legal-tech solutions and modern web development. Passionate about creating scalable, high-performance applications that bridge the gap between complex legal processes and user-friendly digital experiences.

### 🔗 Connect
- **Email**: arshad@legalsuccessindia.com
- **Website**: [Legal Success India](https://legalsuccessindia.com/)

## 📄 License

This project is licensed under the MIT License.

---

**⭐ If you found this project helpful, please give it a star!**