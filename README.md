# AI Chatbot SaaS Platform

A complete full-stack AI Chatbot SaaS application with premium subscription model, multiple AI providers, modern UI, and comprehensive user management features.

## ✨ New Features Added

### Profile Management
- **Update Profile**: Users can update their name and password
- **Account Settings Modal**: Beautiful modal with tabbed interface
- **Password Change**: Secure password updates with current password verification
- **Google OAuth Support**: Different UI for Google vs local accounts

### Account Deletion (GDPR Compliance)
- **User-Initiated Deletion**: Users can delete their own accounts
- **Data Privacy**: Complete removal of user data and conversations
- **Confirmation Required**: Password verification for security
- **Immediate Logout**: Automatic logout after account deletion

### Enhanced Export System
- **PDF Export**: Professional PDF generation with proper formatting
- **Markdown Export**: Rich markdown with emojis and formatting
- **Text Export**: Clean plain text format
- **Export Dropdown**: Beautiful dropdown menu with icons
- **Proper File Naming**: Clean filenames based on chat titles

### Improved Upgrade Flow
- **Limit Detection**: Automatic popup when limits are reached
- **Beautiful Upgrade Modal**: Professional design with feature list
- **Real-time Limit Display**: Shows current usage vs limits
- **Contextual Messaging**: Different messages for chat vs message limits

## 🚀 Features

### Core Functionality
- **Multi-AI Support**: Gemini, Groq, DeepSeek, and more AI models
- **Freemium Model**: Free users (20 chats, 30 messages/chat) vs Premium (unlimited)
- **Real-time Chat**: WebSocket-like experience with typing indicators
- **Export Conversations**: PDF, Markdown, and Text formats
- **Responsive Design**: Mobile-first approach with dark mode

### Authentication & Security
- **JWT Authentication**: Secure token-based auth
- **Google OAuth**: One-click social login
- **Profile Management**: Update profile, change password, delete account
- **Role-based Access**: Free, Premium, Admin roles

### Payment Integration
- **Stripe Checkout**: Secure subscription payments
- **Webhook Handling**: Automatic subscription management
- **Usage Limits**: Automatic enforcement of plan limits

### Admin Dashboard
- **User Analytics**: User distribution, growth metrics
- **Revenue Tracking**: Monthly revenue, subscription analytics
- **Model Usage**: AI model usage statistics
- **User Management**: Upgrade/downgrade users, account management

## 🛠 Tech Stack

### Backend
- **Node.js + Express**: RESTful API server
- **MySQL + Sequelize**: Database with ORM
- **JWT + Passport**: Authentication system
- **Stripe**: Payment processing
- **Multiple AI APIs**: OpenAI, Google Gemini, Groq, etc.

### Frontend
- **React 18 + Vite**: Modern React setup
- **TailwindCSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Recharts**: Analytics visualizations
- **React Router**: Client-side routing

## 🎨 Design System

### Color Palette
- **Primary Gradient**: `#2E0249` → `#570A57` → `#A91079` → `#F806CC`
- **Accent Colors**: 
  - Cyan: `#00CFFF` (buttons, highlights)
  - Green: `#3DFF8C` (success states)
- **Text Colors**:
  - Primary: `#FFFFFF`
  - Secondary: `#E0E0E0`
  - Muted: `#A0A0A0`

### UI Components
- **Glass Morphism**: Backdrop blur effects
- **Gradient Buttons**: Cyan to green gradients
- **Card Design**: Semi-transparent with borders
- **Message Bubbles**: User (gradient) vs AI (glass)

## 📦 Installation

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- Stripe Account
- AI API Keys (Gemini, Groq, etc.)

### Backend Setup

```bash
cd backend
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your credentials

# Database setup
npx sequelize db:create
npx sequelize db:migrate

# Start server
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install

# Start development server
npm run dev
```

### Environment Variables

#### Backend (.env)
```env
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ai_chatbot_saas

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# AI API Keys
GEMINI_API_KEY=your-gemini-api-key
GROQ_API_KEY=your-groq-api-key
# ... other AI API keys

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## 🔧 Configuration

### Database Schema
The application uses three main models:
- **Users**: Authentication, subscription info
- **Chats**: Conversation containers
- **Messages**: Individual chat messages

### AI Model Configuration
Supported AI providers:
- Google Gemini (Direct API)
- Groq (OpenAI-compatible)
- OpenRouter (Multiple models)
- DeepSeek, Cerebras, etc.

### Stripe Integration
- Subscription-based pricing ($9.99/month)
- Webhook handling for subscription events
- Automatic user role updates

## 🚦 Usage Limits

### Free Plan
- 20 chats per account
- 30 messages per chat
- Basic AI models only

### Premium Plan
- Unlimited chats and messages
- All AI models available
- Export functionality
- Priority support

## 📱 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile (name, password)
- `DELETE /api/auth/account` - Delete account (GDPR compliant)
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback

### Chat Management
- `GET /api/chats` - List user chats
- `POST /api/chats` - Create new chat
- `GET /api/chats/:id` - Get chat with messages
- `DELETE /api/chats/:id` - Delete chat
- `GET /api/chats/:id/export?format=text|markdown|pdf` - Export chat in multiple formats

### AI Integration
- `POST /api/chats/:id/messages` - Send message to AI
- `GET /api/chats/models` - Get available AI models

#### Supported AI Models
- **Gemini 1.5 Flash** (Google Direct API)
- **Llama 3.1 8B** (Groq)
- **DeepSeek Chat** (OpenRouter)
- **Gemini 3 27B** (OpenRouter)
- **Gemini 2.5 Pro** (OpenRouter)
- **GLM 4.5 Air** (OpenRouter)
- **Cerebras** (OpenRouter)

### Payments
- `POST /api/stripe/create-session` - Create checkout session
- `GET /api/stripe/success` - Handle successful payment
- `POST /api/stripe/webhook` - Stripe webhook handler

### Admin
- `GET /api/admin/users/stats` - User statistics
- `GET /api/admin/chats/stats` - Chat statistics
- `GET /api/admin/revenue` - Revenue data
- `GET /api/admin/users` - User management

## 🔒 Security Features

- **JWT Token Authentication**
- **Password Hashing** (bcrypt)
- **Input Validation** & Sanitization
- **Rate Limiting** on API endpoints
- **CORS Configuration**
- **Environment Variable Protection**

## 🎯 Key Features Implementation

### Upgrade Popup
When free users hit limits, a beautiful modal appears with:
- Current limit information
- Premium features list
- Direct Stripe checkout integration
- Smooth animations

### Export Functionality
Users can export chats in multiple formats:
- **Text**: Plain text with timestamps
- **Markdown**: Formatted with headers and styling
- **PDF**: Professional document format (future enhancement)

### Admin Dashboard
Comprehensive analytics with:
- User distribution pie charts
- Revenue trend analysis
- AI model usage statistics
- User management interface

## 🚀 Deployment

### Backend Deployment
1. Set up MySQL database
2. Configure environment variables
3. Run database migrations
4. Deploy to your preferred platform (Heroku, AWS, etc.)

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to static hosting (Vercel, Netlify, etc.)
3. Configure API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Contact the development team

---

**Built with ❤️ using React, Node.js, and modern web technologies**