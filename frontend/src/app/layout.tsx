import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { ToastProvider } from "@/providers/toast-provider";

export const metadata: Metadata = {
  title: "NatureCards",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased relative min-h-screen mb-16`}
      >
        <ToastProvider>
          {children}
          <Navigation />
        </ToastProvider>
      </body>
    </html>
  );
}