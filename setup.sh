#!/bin/bash
# Quick local setup: install, configure, migrate. See README.md for details.
set -e

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example. Fill in DATABASE_URL, DIRECT_URL and the Clerk keys, then run this script again."
  exit 0
fi

if grep -q "user:password@localhost" .env; then
  echo "DATABASE_URL / DIRECT_URL in .env are still the example values. Update them first."
  exit 1
fi

echo "Installing dependencies..."
npm install

echo "Applying database migrations..."
npx prisma migrate deploy

echo "Done. Start the app with: npm run dev"
