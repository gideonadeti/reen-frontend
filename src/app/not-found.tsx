import Link from "next/link";
import { Button } from "@/components/ui/button";
import { H1 } from "@/components/ui/typography";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <H1>404</H1>
      <p className="text-muted-foreground mb-6">Page not found</p>
      <Button asChild variant="outline" size="sm">
        <Link href="/products">Return home</Link>
      </Button>
    </div>
  );
}
