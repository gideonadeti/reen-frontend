import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider, SignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "REEN",
    template: "%s | REEN",
  },
  description:
    "Frontend of a scalable e-commerce platform built using microservices architecture",
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider>
            <SignedIn>
              {children}
              <Analytics />
            </SignedIn>
            <SignedOut>
              <div className="h-screen flex items-center justify-center">
                <SignIn />
              </div>
            </SignedOut>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default Layout;
