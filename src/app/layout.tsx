import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider, SignIn, SignedIn, SignedOut } from "@clerk/nextjs";

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
  title: "REEN",
  description:
    "Frontend of a scalable e-commerce platform built using microservices architecture",
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider>
          <SignedIn>{children}</SignedIn>
          <SignedOut>
            <div className="h-screen flex items-center justify-center">
              <SignIn />
            </div>
          </SignedOut>
        </ClerkProvider>
      </body>
    </html>
  );
};

export default Layout;
