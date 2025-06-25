import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";

import ThemeChanger from "./theme-changer";
import CartItemsSheet from "./cart-items-sheet";
import useCartItems from "../hooks/use-cart-items";
import ReenLogo from "../../../../public/reen-logo.png";
import ReenLogoDark from "../../../../public/reen-logo-dark.png";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { H5 } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const [openCartItemsSheet, setOpenCartItemsSheet] = useState(false);
  const { theme, systemTheme } = useTheme();
  const { cartItemsQuery } = useCartItems();
  const cartItems = cartItemsQuery.data || [];
  const isLightTheme = theme === "light" || systemTheme === "light";

  return (
    <>
      <header className="flex items-center ps-2 pe-4 py-2 border-b sticky top-0 bg-background z-50">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mx-2 !h-8" />
        <ThemeChanger />
        <Link href="/profile" className="mx-auto flex items-center gap-1">
          {isLightTheme ? (
            <Image src={ReenLogo.src} alt="REEN logo" width={32} height={32} />
          ) : (
            <Image
              src={ReenLogoDark.src}
              alt="REEN logo"
              width={32}
              height={32}
            />
          )}
          <H5>REEN</H5>
        </Link>
        <div className="flex items-center">
          <UserButton
            appearance={{
              elements: {
                userButtonOuterIdentifier: `${
                  isLightTheme ? "" : "!text-white"
                }`,
              },
            }}
            showName
          />
          <Separator orientation="vertical" className="mx-2 !h-8" />
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8 rounded-full relative"
            onClick={() => setOpenCartItemsSheet(true)}
          >
            <ShoppingCart />
            {cartItems.length > 0 && (
              <Badge className="absolute -top-1.5 -right-1.5 h-4 min-w-4 p-0 px-0.5 text-xs flex items-center justify-center rounded-full bg-blue-500 text-white dark:bg-blue-600">
                {cartItems.length > 99 ? "99+" : cartItems.length}
              </Badge>
            )}
          </Button>
        </div>
      </header>
      <CartItemsSheet
        open={openCartItemsSheet}
        onOpenChange={setOpenCartItemsSheet}
      />
    </>
  );
};

export default Header;
