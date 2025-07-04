import Image from "next/image";
import { X, Pencil } from "lucide-react";
import { useState } from "react";

import formatMoney from "../utils/format-money";
import CreateCartItemDialog from "../products/[productId]/components/create-cart-item-dialog";
import DeleteConfirmationDialog from "./delete-confirmation-dialog";
import { CartItem as CartItemType } from "../types/cart-item";
import { Button } from "@/components/ui/button";
import { Muted } from "@/components/ui/typography";

const CartItem = ({ cartItem }: { cartItem: CartItemType }) => {
  const [openCreateCartItemDialog, setOpenCreateCartItemDialog] =
    useState(false);
  const [openDeleteConfirmationDialog, setOpenDeleteConfirmationDialog] =
    useState(false);

  return (
    <>
      <div className="relative pb-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <div className="border rounded w-16 h-16 relative">
              <Image
                src={cartItem.product.imageUrls[0]}
                alt={`Image of ${cartItem.product.name}`}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="font-medium">{cartItem.product.name}</span>
              <Muted className="text-sm w-32 truncate">
                {cartItem.product.description}
              </Muted>
            </div>
          </div>
          <div className="flex flex-col justify-between items-end">
            <div className="flex flex-col items-end mb-0.5">
              <span className="font-medium">
                {formatMoney(cartItem.product.price * cartItem.quantity)}
              </span>
              <span className="text-xs text-muted-foreground -mt-1">
                {formatMoney(cartItem.product.price)} each
              </span>
            </div>
            <div className="border rounded-full flex items-center gap-2 pl-2 pr-1 py-0.5">
              <span className="text-sm">{cartItem.quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground rounded-full w-6 h-6"
                onClick={() => setOpenCreateCartItemDialog(true)}
              >
                <Pencil />
              </Button>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute -top-2 -left-2 p-0 rounded-full w-6 h-6 bg-muted"
          onClick={() => setOpenDeleteConfirmationDialog(true)}
        >
          <X />
        </Button>
      </div>
      <CreateCartItemDialog
        open={openCreateCartItemDialog}
        onOpenChange={setOpenCreateCartItemDialog}
        product={cartItem.product}
        cartItem={cartItem}
      />
      <DeleteConfirmationDialog
        open={openDeleteConfirmationDialog}
        onOpenChange={setOpenDeleteConfirmationDialog}
        subject={{ key: "Cart-Item", value: cartItem }}
      />
    </>
  );
};

export default CartItem;
