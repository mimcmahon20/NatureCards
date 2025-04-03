import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { ToastProvider } from "@/providers/toast-provider";
import { AuthProvider } from "@/providers/session-provider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/next-auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "NatureCards",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  console.log(session);
  return (
    <html lang="en">
      <body className={`antialiased relative min-h-screen mb-16`}>
        <AuthProvider>
          <ToastProvider>
            {children}
            <Navigation />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
