import Image from "next/image";
import { CartItem as CartItemType } from "../types/cart-item";
import formatMoney from "../utils/format-money";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const CartItem = ({ cartItem }: { cartItem: CartItemType }) => {
  return (
    <div className="relative">
      <div className="flex justify-between">
        <div>
          <div className="border rounded">
            <Image
              src={cartItem.product.imageUrls[0]}
              alt={`Image of ${cartItem.product.name}`}
              className="object-cover"
            />
          </div>
          <p>{cartItem.product.name}</p>
        </div>
        <div className="flex flex-col">
          <p>{formatMoney(cartItem.product.price)}</p>
          <div className="border rounded-full">
            <button className="text-muted-foreground">-</button>
            <p>{cartItem.quantity}</p>
            <button className="text-muted-foreground">+</button>
          </div>
        </div>
      </div>
      <Button variant="ghost" size="sm">
        <X />
      </Button>
    </div>
  );
};

export default CartItem;
