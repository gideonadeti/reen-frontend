import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";

import ThemeChanger from "./theme-changer";
import CartItemsSheet from "./cart-items-sheet";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { H5 } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

const Header = () => {
  const { theme, systemTheme } = useTheme();
  const [openCartItemsSheet, setOpenCartItemsSheet] = useState(false);

  return (
    <>
      <header className="flex items-center ps-2 pe-4 py-2 border-b sticky top-0 bg-background z-50">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mx-2 !h-8" />
        <ThemeChanger />
        <Link href="/products" className="mx-auto">
          <H5>REEN</H5>
        </Link>
        <div className="flex items-center">
          <UserButton
            appearance={{
              elements: {
                userButtonOuterIdentifier: `${
                  theme === "light" || systemTheme === "light"
                    ? ""
                    : "!text-white"
                }`,
              },
            }}
            showName
          />
          <Separator orientation="vertical" className="mx-2 !h-8" />
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8 rounded-full"
            onClick={() => setOpenCartItemsSheet(true)}
          >
            <ShoppingCart />
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
