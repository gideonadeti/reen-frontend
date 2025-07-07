import { Loader, ShoppingCart } from "lucide-react";
import { useState } from "react";

import useCartItems from "../hooks/use-cart-items";
import CartItem from "./cart-item";
import formatMoney from "../utils/format-money";
import CheckoutDialog from "./checkout-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Muted } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface CartItemsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CartItemsSheet = ({ open, onOpenChange }: CartItemsSheetProps) => {
  const { cartItemsQuery } = useCartItems();
  const cartItems = cartItemsQuery.data || [];
  const totalCost = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const maxCost = 999999.99; // $999,999.99
  const hasExceededMaxCost = totalCost > maxCost;

  const [openCheckoutDialog, setOpenCheckoutDialog] = useState(false);

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>My Cart</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[76%]">
            <div className="flex-1 px-4 py-2 space-y-4 divide-y">
              {cartItemsQuery.isPending ? (
                <div className="h-4/5 flex items-center justify-center">
                  <Loader className="animate-spin" />
                </div>
              ) : cartItems.length > 0 ? (
                cartItems.map((cartItem) => (
                  <CartItem key={cartItem.id} cartItem={cartItem} />
                ))
              ) : (
                <div className="h-[68vh] flex flex-col items-center justify-center">
                  <ShoppingCart size={60} />
                  <p className="font-medium text-lg">Your cart is empty.</p>
                </div>
              )}
            </div>
          </ScrollArea>
          <SheetFooter>
            <div className="flex items-center justify-between px-4 py-2 border-b-2">
              <Muted className="font-medium">Total:</Muted>
              <span className="font-semibold">{formatMoney(totalCost)}</span>
            </div>
            <Button
              variant="ghost"
              onClick={() => setOpenCheckoutDialog(true)}
              disabled={
                cartItemsQuery.isPending ||
                cartItems.length === 0 ||
                hasExceededMaxCost
              }
              className="bg-blue-600 rounded-full h-8 font-medium cursor-pointer"
            >
              Proceed to checkout
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <CheckoutDialog
        open={openCheckoutDialog}
        onOpenChange={setOpenCheckoutDialog}
      />
    </>
  );
};

export default CartItemsSheet;
