import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/shared/components/layout/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import ServiceWorkerRegister from "@/shared/components/layout/service-worker-register";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Aurum",
  description: "AI-powered personal finance: accounts, budgets, investments, subscriptions and bank feeds in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <html lang="en" suppressHydrationWarning>
          <head>
            <link rel="icon" href="/logo-sm.png" sizes="any" />
          </head>
          <body className={`${inter.className}`}>
            <ServiceWorkerRegister />
            <Header />
            <main className="min-h-screen">{children}</main>
            <Toaster richColors />

            <footer className="bg-blue-50 dark:bg-gray-900 py-12">
              <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
                <p>Aurum &copy; {new Date().getFullYear()}</p>
              </div>
            </footer>
          </body>
        </html>
      </ThemeProvider>
    </ClerkProvider>
  );
}
