# Vercel Environment Variables

Copy these environment variables to your Vercel dashboard:

## Backend Environment Variables
```
PORT=5001
NODE_ENV=production
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=ai_chatbot_saas
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
OPENAI_API_KEY=your-openai-api-key
GEMINI_API_KEY=your-gemini-api-key
GROQ_API_KEY=your-groq-api-key
CEREBRAS_API_KEY=your-cerebras-api-key
DEEPSEEK_API_KEY=your-deepseek-api-key
GEMINI_3_27B_API_KEY=your-gemini-3-27b-api-key
GEMINI_2_5_PRO_API_KEY=your-gemini-2-5-pro-api-key
GLM_4_5_AIR_API_KEY=your-glm-4-5-air-api-key
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

## Frontend Environment Variables
```
VITE_API_URL=https://your-backend-domain.vercel.app
```

## Setup Steps
1. Deploy backend to Vercel
2. Copy backend URL to frontend VITE_API_URL
3. Deploy frontend to Vercel
4. Update backend FRONTEND_URL with frontend URL