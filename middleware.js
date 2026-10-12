import arcjet, { createMiddleware, detectBot, shield } from "@arcjet/next";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)",
  "/budget(.*)",
  "/bank(.*)",
  "/crypto(.*)",
  "/investments(.*)",
  "/profile(.*)",
  "/receipt(.*)",
  "/reports(.*)",
  "/settings(.*)",
  "/subscriptions(.*)",
]);

// Server-to-server callers (Plaid, Clerk, Inngest) are "bots" by definition,
// so they skip Arcjet and rely on their own signature verification.
const isMachineRoute = createRouteMatcher([
  "/api/webhooks(.*)",
  "/api/inngest(.*)",
]);

// Clerk middleware: redirect signed-out users away from protected pages
const clerk = clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn();
  }

  return NextResponse.next();
});

// Arcjet is optional: without ARCJET_KEY (e.g. local development) only Clerk runs.
let middleware = clerk;

if (process.env.ARCJET_KEY) {
  const aj = arcjet({
    key: process.env.ARCJET_KEY,
    rules: [
      // Shield protection for content and security
      shield({
        mode: "LIVE",
      }),
      detectBot({
        mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
        allow: [
          "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
          "GO_HTTP", // For Inngest
          // See the full list at https://arcjet.com/bot-list
        ],
      }),
    ],
  });

  const arcjetThenClerk = createMiddleware(aj, clerk);
  middleware = (req, event) =>
    isMachineRoute(req) ? clerk(req, event) : arcjetThenClerk(req, event);
}

export default middleware;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
