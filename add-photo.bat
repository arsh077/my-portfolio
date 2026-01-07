@echo off
echo.
echo ========================================
echo   ADD YOUR PHOTO TO PORTFOLIO
echo ========================================
echo.
echo Instructions:
echo 1. Save your red background photo as "profile-red-bg.jpg"
echo 2. Copy it to the "public" folder
echo 3. Refresh your browser
echo.
echo Current location: %CD%\public\
echo.
echo Press any key to open the public folder...
pause >nul
explorer public
echo.
echo After adding your photo, refresh your browser at:
echo http://localhost:5173/
echo.
pause