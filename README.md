# AI Finance Platform

An AI-powered finance platform built with Next.js, Supabase, Tailwind, Prisma, Inngest, ArcJet, and Shadcn UI.

## Overview

This platform integrates AI capabilities for financial insights, automated transactions, and personalized recommendations. Built with modern web technologies for a seamless user experience.

## Tech Stack

- Next.js 14 (App Router)
- Supabase (Database & Auth)
- Prisma ORM
- Tailwind CSS
- Shadcn UI
- Clerk Authentication
- Gemini AI
- Inngest (Background Jobs)
- ArcJet (Rate Limiting)
- Resend (Email)

## Setup

Create a `.env` file with the following variables:

```env
DATABASE_URL=
DIRECT_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

GEMINI_API_KEY=

RESEND_API_KEY=

ARCJET_KEY=
```

## Installation

```bash
npm install
npm run dev
```

## License

Proprietary - All rights reserved.

## Author

Alakhdeep Singh
