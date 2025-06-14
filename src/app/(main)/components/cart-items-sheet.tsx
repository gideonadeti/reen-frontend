import { Loader, ShoppingCart } from "lucide-react";

import useCartItems from "../hooks/use-cart-items";
import CartItem from "./cart-item";
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>My Cart</SheetTitle>
        </SheetHeader>
        <div className="flex-1">
          {cartItemsQuery.isPending ? (
            <div className="h-4/5 flex items-center justify-center">
              <Loader className="animate-spin" />
            </div>
          ) : cartItems.length > 0 ? (
            cartItems.map((cartItem) => (
              <CartItem key={cartItem.id} cartItem={cartItem} />
            ))
          ) : (
            <div className="h-4/5 flex flex-col items-center justify-center">
              <ShoppingCart size={60} />
              <p className="font-medium text-lg">Your cart is empty.</p>
            </div>
          )}
        </div>
        <SheetFooter>
          <div></div>
          <button className="bg-blue-600 rounded-full h-8 font-medium cursor-pointer hover:bg-blue-800">
            Proceed to checkout
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CartItemsSheet;
