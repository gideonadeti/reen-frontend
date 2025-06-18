"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, ArrowLeft, Home, Mail } from "lucide-react";

import CheckoutDialog from "../components/checkout-dialog";
import ContactSupportDialog from "../components/contact-support-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Page = () => {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");
  const [openCheckoutDialog, setOpenCheckoutDialog] = useState(false);
  const [openContactSupportDialog, setOpenContactSupportDialog] =
    useState(false);

  useEffect(() => {
    if (success === "true") {
      const triggerConfetti = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = "fixed";
        canvas.style.top = "0";
        canvas.style.left = "0";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.pointerEvents = "none";
        canvas.style.zIndex = "9999";

        document.body.appendChild(canvas);

        const particles: Array<{
          x: number;
          y: number;
          vx: number;
          vy: number;
          color: string;
          size: number;
          life: number;
        }> = [];

        const colors = [
          "#ff6b6b",
          "#4ecdc4",
          "#45b7d1",
          "#96ceb4",
          "#ffeaa7",
          "#dda0dd",
        ];

        // Create particles
        for (let i = 0; i < 200; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: -10,
            vx: (Math.random() - 0.5) * 8,
            vy: Math.random() * 3 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 4 + 2,
            life: 1,
          });
        }

        const animate = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          particles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1; // gravity
            particle.life -= 0.008;

            if (particle.life > 0 && particle.y < canvas.height) {
              ctx.globalAlpha = particle.life;
              ctx.fillStyle = particle.color;
              ctx.fillRect(
                particle.x,
                particle.y,
                particle.size,
                particle.size
              );
            } else {
              particles.splice(index, 1);
            }
          });

          if (particles.length > 0) {
            requestAnimationFrame(animate);
          } else {
            document.body.removeChild(canvas);
          }
        };

        animate();
      };

      const timer = setTimeout(triggerConfetti, 400);

      return () => clearTimeout(timer);
    }
  }, [success]);

  if (success === "true") {
    return (
      <div className="h-4/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-200 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">
              Payment Successful!
            </CardTitle>
            <CardDescription className="text-green-600">
              Thank you for your purchase. Your payment has been processed
              successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              You should receive a confirmation email shortly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="flex-1">
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Return Home
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/orders">
                  <Mail className="w-4 h-4 mr-2" />
                  View Orders
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (canceled === "true") {
    return (
      <>
        <div className="h-4/5 flex items-center justify-center p-4">
          <Card className="w-full max-w-md text-center">
            <CardHeader className="pb-4">
              <div className="mx-auto mb-4 w-16 h-16 bg-red-200 rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-red-800">
                Payment Canceled
              </CardTitle>
              <CardDescription className="text-red-600">
                Your payment was canceled. No charges have been made to your
                account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                If you experienced any issues during checkout, please don&apos;t
                hesitate to contact our support team.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="flex-1">
                  <Link href="/">
                    <Home className="w-4 h-4 mr-2" />
                    Return Home
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="flex-1"
                  onClick={() => setOpenCheckoutDialog(true)}
                >
                  <span>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Try Again
                  </span>
                </Button>
              </div>
              <Button
                variant="ghost"
                asChild
                className="w-full"
                onClick={() => setOpenContactSupportDialog(true)}
              >
                <span>
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Support
                </span>
              </Button>
            </CardContent>
          </Card>
        </div>
        <CheckoutDialog
          open={openCheckoutDialog}
          onOpenChange={setOpenCheckoutDialog}
        />
        <ContactSupportDialog
          open={openContactSupportDialog}
          onOpenChange={setOpenContactSupportDialog}
        />
      </>
    );
  }

  // Default state - no parameters or invalid parameters
  return (
    <div className="h-4/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Checkout</CardTitle>
          <CardDescription>Processing your request...</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
