import Link from "next/link";

import { Button } from "./button";

interface CustomLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const CustomLink = ({ href, children, className = "" }: CustomLinkProps) => (
  <Button
    variant="link"
    className={`text-blue-500 underline hover:text-blue-700 ${className}`}
    asChild
  >
    <Link href={href}>{children}</Link>
  </Button>
);

export default CustomLink;
