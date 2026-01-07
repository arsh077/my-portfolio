@echo off
echo.
echo ========================================
echo   GITHUB REPOSITORY SETUP
echo ========================================
echo.
echo This script will help you push your portfolio to GitHub
echo.
echo STEP 1: Initialize Git Repository
echo ----------------------------------------
git init
echo ✅ Git repository initialized
echo.

echo STEP 2: Add all files
echo ----------------------------------------
git add .
echo ✅ All files added to git
echo.

echo STEP 3: Create initial commit
echo ----------------------------------------
git commit -m "Initial commit: Complete Arshad Anwar portfolio with Flask backend and admin panel"
echo ✅ Initial commit created
echo.

echo ========================================
echo   NEXT STEPS:
echo ========================================
echo.
echo 1. Go to GitHub.com and create a new repository
echo    - Repository name: arshad-anwar-portfolio
echo    - Description: Professional portfolio with Flask backend
echo    - Make it PUBLIC (recommended for portfolio)
echo    - DON'T initialize with README (we already have one)
echo.
echo 2. After creating the repository, run these commands:
echo    (Replace YOUR_USERNAME with your actual GitHub username)
echo.
echo    git remote add origin https://github.com/YOUR_USERNAME/arshad-anwar-portfolio.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 3. Your portfolio will be live on GitHub!
echo.
echo 4. Deploy frontend to Vercel:
echo    - Go to vercel.com
echo    - Import your GitHub repository
echo    - Deploy automatically
echo.
echo 5. Deploy backend to Heroku:
echo    - Follow the GITHUB_DEPLOYMENT_GUIDE.md
echo.
echo ========================================
echo   YOUR PORTFOLIO IS READY FOR GITHUB!
echo ========================================
echo.
pause