# Quick Setup Guide

## Clone and Install
```bash
git clone https://github.com/ArunEswarramurthy/techsurf---project.git
cd techsurf---project
```

## Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

## Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Development (Windows)
```bash
# Run both servers at once
start-dev.bat
```

## Required Environment Variables
- Database: MySQL connection details
- JWT_SECRET: Your JWT secret key
- Google OAuth: Client ID and secret
- Stripe: Secret key and webhook secret
- AI APIs: Gemini, Groq, etc.

See README.md for complete setup instructions.