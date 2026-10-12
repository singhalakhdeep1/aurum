import { seedTransactions } from "@/actions/seed";

// Development only: seeds demo transactions for the signed-in user.
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return new Response("Not found", { status: 404 });
  }
  const result = await seedTransactions();
  return Response.json(result, { status: result.success ? 200 : 400 });
}
