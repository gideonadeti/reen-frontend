"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { H1 } from "@/components/ui/typography";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <H1>404</H1>
      <p className="text-muted-foreground mb-6">Page not found</p>
      <div className="flex gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href="/products">Return home</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="cursor-pointer"
        >
          <span>Return back</span>
        </Button>
      </div>
    </div>
  );
}
