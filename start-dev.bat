@echo off
echo Starting AI Chatbot SaaS Development Environment...
echo.

echo Setting up database...
cd backend
npm run setup
echo.

echo Starting Backend Server...
start "Backend" cmd /k "npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Frontend" cmd /k "cd ../frontend && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5001
echo Frontend: http://localhost:3000
echo.
pause