import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { Loader } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import CartItemsSheet from "@/app/(main)/components/cart-items-sheet";
import useCartItems from "@/app/(main)/hooks/use-cart-items";
import { CartItem } from "@/app/(main)/types/cart-item";
import { Product } from "../../types/product";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export let createCartItemFormSchema: z.ZodObject<{
  quantity: z.ZodNumber;
}>;

interface CreateCartItemDialogProps {
  open: boolean;
  product: Product;
  cartItem?: CartItem;
  onOpenChange: (open: boolean) => void;
}

const CreateCartItemDialog = ({
  open,
  product,
  cartItem,
  onOpenChange,
}: CreateCartItemDialogProps) => {
  const { createCartItemMutation, updateCartItemMutation } = useCartItems();
  const [openCartItemsSheet, setOpenCartItemsSheet] = useState(false);
  const isSubmitting =
    createCartItemMutation.isPending || updateCartItemMutation.isPending;
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  createCartItemFormSchema = z.object({
    quantity: z.coerce
      .number()
      .int({ message: "Quantity must be an integer" })
      .min(1, {
        message: "Quantity must be a positive number",
      })
      .max(product.quantity, {
        message: `Quantity must be less than ${product.quantity}`,
      }),
  });
  const form = useForm<z.infer<typeof createCartItemFormSchema>>({
    resolver: zodResolver(createCartItemFormSchema),
    defaultValues: {
      quantity: cartItem?.quantity || 1,
    },
  });

  // Reset form when cart item changes or dialog opens
  useEffect(() => {
    if (open) {
      const defaultValues = {
        quantity: cartItem?.quantity || 1,
      };

      form.reset(defaultValues);
    }
  }, [open, cartItem, form]);

  const closeCreateCartItemDialog = () => {
    form.reset();

    onOpenChange(false);
  };

  const onSubmit = (values: z.infer<typeof createCartItemFormSchema>) => {
    if (!cartItem) {
      createCartItemMutation.mutate({
        productId: product.id,
        formValues: values,
        closeCreateCartItemDialog,
        setOpenCartItemsSheet,
      });
    } else {
      updateCartItemMutation.mutate({
        id: cartItem.id,
        productId: product.id,
        formValues: values,
        closeCreateCartItemDialog,
      });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {cartItem ? "Update" : "Create"} Cart Item
            </DialogTitle>
            <DialogDescription>
              Enter a quantity between 1 and {product.quantity}.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
            >
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button type="submit" className="hidden" ref={submitButtonRef} />
            </form>
          </Form>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => closeCreateCartItemDialog()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              disabled={isSubmitting || !form.formState.isValid}
              onClick={() => submitButtonRef.current?.click()}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <Loader className="animate-spin" />
                  <span>Submitting...</span>
                </span>
              ) : (
                "Submit"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <CartItemsSheet
        open={openCartItemsSheet}
        onOpenChange={setOpenCartItemsSheet}
      />
    </>
  );
};

export default CreateCartItemDialog;
