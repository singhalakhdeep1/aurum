# Aurum - AI Finance Platform

A comprehensive AI-powered finance platform with advanced features including crypto wallet, DeFi integration, payment processing, and business intelligence analytics.

## 🚀 Overview

Aurum is a modern financial management platform that combines traditional finance with Web3 capabilities. It offers AI-powered insights, multi-chain crypto wallet support, DeFi protocol integration, payment gateway processing, and advanced business intelligence dashboards.

## ✨ Key Features

### Core Financial Management
- **AI-Powered Insights**: Get personalized financial advice using Google Gemini AI
- **Transaction Tracking**: Comprehensive income and expense management
- **Budget Management**: Set and track budgets with smart alerts
- **Account Management**: Multiple account types (Current, Savings)
- **Recurring Transactions**: Automated recurring payment processing
- **Real-time Notifications**: Email alerts via Resend

### Crypto & Web3
- **Multi-Chain Wallet**: Support for Ethereum, Polygon, and BSC
- **Non-Custodial Wallet**: Secure wallet creation and management
- **Token Management**: ERC-20 token balance tracking
- **Transaction History**: Complete crypto transaction records
- **Gas Fee Estimation**: Real-time gas fee calculations
- **WalletConnect Integration**: Connect with popular wallets

### DeFi Integration
- **DEX Integration**: Uniswap token swapping
- **Liquidity Management**: Pool management and tracking
- **Yield Farming**: High-yield protocol integration
- **Staking**: ETH and token staking support
- **APY Tracking**: Real-time yield monitoring
- **Risk Assessment**: Protocol risk evaluation

### Payment Processing
- **Stripe Integration**: Credit/debit card processing
- **Subscription Management**: Recurring billing
- **Invoice Generation**: Automated invoice creation
- **Multi-Currency Support**: International payment support
- **Payment History**: Complete transaction records

### Business Intelligence
- **Financial Dashboards**: Real-time performance metrics
- **Data Visualization**: Interactive charts with Recharts
- **Custom Reports**: Exportable financial reports
- **Trend Analysis**: Spending pattern analysis
- **Forecasting**: Predictive financial analytics
- **Anomaly Detection**: Unusual activity alerts

### 🆕 Premium Features

#### User Experience
- **Dark/Light Mode**: Theme switching with system preference detection
- **Push Notifications**: Real-time alerts for transactions, budget limits, and updates
- **Progressive Web App (PWA)**: Install on desktop and mobile devices
- **Multi-language Support**: 10+ languages (English, Spanish, French, German, Chinese, Japanese, Korean, Hindi, Arabic, Portuguese)

#### Security
- **Biometric Authentication**: WebAuthn support for fingerprint, Face ID, and other biometric methods
- **Two-Factor Authentication**: Enhanced security with 2FA support

#### Banking Integration
- **Plaid Integration**: Connect 10,000+ banks worldwide for automatic transaction syncing
- **Real-time Bank Feeds**: Automatic account balance and transaction updates
- **Bank Account Management**: Link and manage multiple bank accounts

#### Smart Features
- **Receipt Scanning (OCR)**: Scan receipts to auto-add expenses using Tesseract.js
- **Subscription Management**: Track, analyze, and manage recurring subscriptions
- **Smart Insights**: AI-powered recommendations for subscription optimization
- **Investment Portfolio Tracking**: Monitor stocks, ETFs, mutual funds, and crypto investments
- **Performance Analytics**: Track investment performance with detailed metrics

#### Social & Gamification
- **Achievements System**: Unlock badges for financial milestones
- **Leaderboards**: Compare progress with other users
- **Daily Challenges**: Complete daily financial tasks for rewards
- **Social Sharing**: Share achievements and progress on social media
- **Leveling System**: Earn XP and level up through financial activities

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router, Turbopack)
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui (Radix UI)
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Date Handling**: date-fns + react-day-picker
- **Icons**: Lucide React

### Backend
- **Database**: PostgreSQL (via Neon DB)
- **ORM**: Prisma
- **Authentication**: Clerk
- **AI**: Google Gemini AI
- **Email**: Resend + React Email
- **Background Jobs**: Inngest
- **Security**: ArcJet (Rate limiting, bot protection)

### Web3 & Payments
- **Blockchain**: viem (Ethereum, Polygon, BSC)
- **Payments**: Stripe
- **WalletConnect**: Multi-wallet support

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database (Neon DB recommended)
- Clerk account (for authentication)
- Google AI Studio account (for Gemini AI)
- Resend account (for emails)
- ArcJet account (optional, for security)

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Alakhdeepsingh/aurum.git
cd aurum
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://username:password@host/database?sslmode=require
DIRECT_URL=postgresql://username:password@host/database?sslmode=require

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# AI Integration
GEMINI_API_KEY=your_gemini_api_key

# Email Service
RESEND_API_KEY=your_resend_api_key

# Security (Optional for development)
ARCJET_KEY=your_arcjet_key

# Payment Gateways
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret
SQUARE_ACCESS_TOKEN=your_square_access_token

# Crypto & Web3
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
INFURA_PROJECT_ID=your_infura_project_id
ALCHEMY_API_KEY=your_alchemy_api_key
RPC_URL=https://eth.llamarpc.com

# DeFi Protocols
UNISWAP_V3_SUBGRAPH_URL=your_uniswap_subgraph_url
AAVE_SUBGRAPH_URL=your_aave_subgraph_url

# Analytics (Optional)
NEXT_PUBLIC_MIXPANEL_TOKEN=your_mixpanel_token
AMPLITUDE_API_KEY=your_amplitude_api_key

# Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key

# Plaid Bank Integration
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
PLAID_ENV=sandbox
```

### 4. Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed database with sample data
npm run seed
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
aurum/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth route group
│   ├── (dashboard)/         # Dashboard route group
│   ├── (public)/            # Public route group
│   ├── api/                 # API routes
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── features/                # Feature-based modules
│   ├── auth/                # Authentication feature
│   ├── accounts/            # Account management
│   ├── transactions/        # Transaction management
│   ├── budget/              # Budget management
│   ├── investments/         # Investment tracking
│   ├── crypto/              # Crypto wallet
│   ├── subscriptions/       # Subscription management
│   └── notifications/       # Push notifications
├── shared/                  # Shared utilities
│   ├── components/          # Reusable components
│   │   ├── ui/             # shadcn/ui components
│   │   └── layout/         # Layout components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility libraries
│   │   ├── db/              # Database utilities
│   │   ├── utils/           # General utilities
│   │   └── validators/      # Validation schemas
│   └── types/               # TypeScript types
├── config/                  # Configuration files
│   ├── env.ts               # Environment variables
│   ├── constants.ts         # App constants
│   └── db.ts                # Database config
├── prisma/                  # Database schema
└── public/                  # Static assets
```

## 🗄 Database Schema

The platform uses PostgreSQL with the following main models:

- **User**: User accounts linked to Clerk authentication
- **Account**: Bank accounts (Current, Savings)
- **Transaction**: Income and expense records
- **Budget**: Monthly budget tracking

## 🔐 Security Features

- **Authentication**: Clerk-based secure authentication
- **Rate Limiting**: ArcJet for API protection
- **Bot Protection**: Automated bot detection
- **Secure Headers**: Next.js security headers
- **Environment Variables**: Sensitive data in .env
- **SQL Injection Prevention**: Prisma ORM parameterized queries

## 📊 Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run email        # Start email development server
npm run postinstall  # Generate Prisma client (auto-run after install)
```

## 🌐 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Make sure to add all environment variables from the `.env` file to your deployment platform.

## 🧪 Testing

The project includes comprehensive testing setup. Run tests with:

```bash
npm run test
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

Proprietary - All rights reserved.

## 👤 Author

**Alakhdeep Singh**

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Authentication by [Clerk](https://clerk.com/)
- AI powered by [Google Gemini](https://ai.google.dev/)
- Database hosted on [Neon](https://neon.tech/)

## 📞 Support

For support, email support@aurum.com or open an issue in the repository.

## 🔮 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced AI predictions
- [ ] More DeFi protocols
- [ ] NFT marketplace integration
- [ ] Multi-language support
- [ ] Advanced analytics with ML

---

**Status**: ✅ Production Ready
