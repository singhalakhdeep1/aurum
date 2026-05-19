# 🚀 AI Finance Platform - Setup Guide

## Quick Start (Already Done ✅)
- ✅ Dependencies installed
- ✅ .env file created (needs configuration)

## 📝 Setup Instructions

### Step 1: Configure Database (Neon DB - Recommended)

1. **Go to Neon DB**: https://neon.tech
2. **Sign up/Login**
3. **Create New Project**:
   - Click "Create Project"
   - Name it: "ai-finance-platform"
   - Select region closest to you
4. **Get Connection Strings**:
   - Copy the **Pooled connection string** → paste as `DATABASE_URL`
   - Copy the **Direct connection string** → paste as `DIRECT_URL`
   - Both should look like: `postgresql://username:password@host/database?sslmode=require`

**Update in `.env` file!**

---

### Step 2: Configure Clerk Authentication

1. **Go to Clerk**: https://clerk.com
2. **Sign up/Login**
3. **Create Application**:
   - Click "Add application"
   - Name it: "AI Finance Platform"
   - Choose your preferred sign-in methods (Email, Google, etc.)
4. **Get API Keys**:
   - Go to "API Keys" in sidebar
   - Copy `Publishable key` → paste as `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Copy `Secret key` → paste as `CLERK_SECRET_KEY`

**Update in `.env` file!**

---

### Step 3: Configure Google Gemini AI

1. **Go to Google AI Studio**: https://aistudio.google.com/app/apikey
2. **Sign in with Google account**
3. **Create API Key**:
   - Click "Get API Key"
   - Click "Create API key in new project" (or use existing)
   - Copy the API key
4. **Paste** in `.env` as `GEMINI_API_KEY`

**Update in `.env` file!**

---

### Step 4: Configure Resend (Email Service)

1. **Go to Resend**: https://resend.com
2. **Sign up/Login**
3. **Create API Key**:
   - Go to "API Keys" tab
   - Click "Create API Key"
   - Name it: "AI Finance Platform"
   - Click "Add"
4. **Copy the key** → paste as `RESEND_API_KEY`

**Update in `.env` file!**

---

### Step 5: Configure ArcJet (Security - Optional for Development)

1. **Go to ArcJet**: https://arcjet.com
2. **Sign up/Login**
3. **Create Site**:
   - Add a new site
   - Name: "AI Finance Platform"
4. **Get API Key**:
   - Copy the site key
   - Paste as `ARCJET_KEY`

**Note**: You can skip this for local development initially

**Update in `.env` file if needed!**

---

### Step 6: Initialize Database

After configuring your `.env` file with at least the **DATABASE_URL**, run:

```bash
npm run postinstall
npx prisma db push
npx prisma generate
```

This will:
- Generate Prisma Client
- Create database tables
- Set up the schema

---

### Step 7: Run the Development Server

```bash
npm run dev
```

Your app will be available at: **http://localhost:3000**

---

## 🎯 Features of This Project

- 💰 **Budget Management**: Track income and expenses
- 📊 **AI-Powered Insights**: Get financial advice from Gemini AI
- 📈 **Data Visualization**: Beautiful charts with Recharts
- 🔐 **Secure Authentication**: Clerk-based auth
- 📧 **Email Notifications**: Automated emails with Resend
- 🎨 **Modern UI**: Tailwind CSS + Shadcn UI components
- 🛡️ **Security**: Rate limiting with ArcJet
- ⚡ **Background Jobs**: Inngest for async tasks

---

## 📱 What to Do After Setup

1. **Sign up** for an account at http://localhost:3000
2. **Complete onboarding**
3. **Add accounts** (bank accounts, credit cards, etc.)
4. **Create transactions** (income/expenses)
5. **Set budgets** for different categories
6. **Get AI insights** on your spending

---

## 🐛 Troubleshooting

### Dependencies Installation Failed?
```bash
rm -rf node_modules package-lock.json
npm install
```

### Prisma Issues?
```bash
npx prisma generate
npx prisma db push
```

### Port 3000 Already in Use?
```bash
# Kill process on port 3000
npx kill-port 3000
# Or run on different port
PORT=3001 npm run dev
```

---

## 📚 Tech Stack Details

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Database**: PostgreSQL (Neon), Prisma ORM
- **Auth**: Clerk
- **AI**: Google Gemini
- **Email**: Resend
- **Charts**: Recharts
- **Security**: ArcJet
- **Jobs**: Inngest

---

## ✅ Ready to Go!

Once you've completed these steps, your AI Finance Platform will be fully functional!

**Need help?** Check the original tutorial: https://youtu.be/egS6fnZAdzk
