@echo off
echo.
echo ========================================
echo   ARSHAD ANWAR PORTFOLIO BACKEND
echo ========================================
echo.
echo Starting Flask backend server...
echo.
echo Admin Panel: http://localhost:5000/admin/login
echo API Docs: http://localhost:5000/api/docs
echo Health Check: http://localhost:5000/health
echo.
echo Default Admin Credentials:
echo Username: admin
echo Password: admin123
echo.
echo ⚠️  IMPORTANT: Change these in production!
echo.
cd backend
python app.py
pause