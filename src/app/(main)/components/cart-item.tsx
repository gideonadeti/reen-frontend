import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
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
            <span className="font-medium">
              {formatMoney(cartItem.product.price)}
            </span>
            <div className="border rounded-full flex items-center gap-2 px-2 py-1">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground rounded-full w-6 h-6"
                onClick={() => setOpenCreateCartItemDialog(true)}
              >
                <Plus />
              </Button>
              <p>{cartItem.quantity}</p>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground p-0 rounded-full w-6 h-6"
                onClick={() => setOpenCreateCartItemDialog(true)}
              >
                <Minus />
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
