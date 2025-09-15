# 🚀 Deploy to Render

## Quick Deploy Steps:

### 1. Setup MongoDB Atlas
- Create free cluster at https://cloud.mongodb.com
- Get connection string

### 2. Deploy to Render
- Go to https://render.com
- Connect GitHub repo: `ChatBot-Ai`
- Create Web Service:
  - Build: `cd backend && npm install`
  - Start: `cd backend && npm start`

### 3. Environment Variables
Set in Render dashboard:
```
NODE_ENV=production
PORT=10000
MONGODB_URI=your-atlas-connection-string
JWT_SECRET=your-jwt-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GEMINI_API_KEY=your-gemini-key
GROQ_API_KEY=your-groq-key
FRONTEND_URL=your-frontend-url
```

### 4. Deploy Frontend
- Use Netlify for frontend
- Set VITE_API_URL to your Render backend URL

Your app will be live! 🎉