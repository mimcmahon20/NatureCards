import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { ToastProvider } from "@/providers/toast-provider";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

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
          <NextSSRPlugin
            /**
             * Extract only the route configs to prevent leaking 
             * additional information to the client
             */
            routerConfig={extractRouterConfig(ourFileRouter)}
          />
          {children}
          <Navigation />
        </ToastProvider>
      </body>
    </html>
  );
}