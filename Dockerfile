FROM node:20-alpine
WORKDIR /app

# .npmrc carries legacy-peer-deps (react-day-picker 8 predates React 19)
COPY package.json package-lock.json .npmrc ./
RUN npm ci

COPY . .

# NEXT_PUBLIC_* values are inlined into the client bundle, so they are needed at build time.
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_VAPID_PUBLIC_KEY
ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY \
    NEXT_PUBLIC_VAPID_PUBLIC_KEY=$NEXT_PUBLIC_VAPID_PUBLIC_KEY \
    NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

# Build-time placeholders only; real values come from the environment at runtime.
RUN DATABASE_URL=postgresql://build:build@localhost:5432/build \
    DIRECT_URL=postgresql://build:build@localhost:5432/build \
    CLERK_SECRET_KEY=sk_test_build \
    npm run build

ENV NODE_ENV=production
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
