# Vercel Deployment Fix

## Backend Issues Fixed:
1. Created `api/index.js` for Vercel serverless functions
2. Updated `vercel.json` configuration
3. Fixed database connection for production

## Required Environment Variables for Vercel:
```
DATABASE_URL=mysql://user:password@host:port/database
NODE_ENV=production
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0
FRONTEND_URL=https://your-frontend.vercel.app
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
GEMINI_API_KEY=your-gemini-api-key
GROQ_API_KEY=your-groq-api-key
```

## Deploy Steps:
1. Push changes to GitHub
2. Connect GitHub repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy backend first
5. Update frontend VITE_API_URL with backend URL
6. Deploy frontend

## Database Setup:
Use a cloud MySQL service like:
- PlanetScale (recommended)
- Railway
- AWS RDS
- Google Cloud SQL