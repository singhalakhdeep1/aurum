#!/bin/bash

echo "🚀 AI Finance Platform - Quick Setup Script"
echo "=========================================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please configure your .env file first (see SETUP-GUIDE.md)"
    exit 1
fi

# Check if DATABASE_URL is configured
if grep -q "postgresql://username:password" .env; then
    echo "⚠️  DATABASE_URL not configured!"
    echo "Please add your Neon DB connection string in .env file"
    echo "See SETUP-GUIDE.md for instructions"
    exit 1
fi

echo "✅ Environment variables found"
echo ""

echo "📦 Generating Prisma Client..."
npx prisma generate

echo ""
echo "🗄️  Pushing database schema..."
npx prisma db push

echo ""
echo "✅ Database setup complete!"
echo ""
echo "🎉 You're all set! Run 'npm run dev' to start the server"
echo "🌐 App will be available at http://localhost:3000"
