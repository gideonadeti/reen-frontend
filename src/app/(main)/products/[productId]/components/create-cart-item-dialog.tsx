import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { Loader } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import CartItemsSheet from "@/app/(main)/components/cart-items-sheet";
import useCartItems from "@/app/(main)/hooks/use-cart-items";
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
  onOpenChange: (open: boolean) => void;
}

const CreateCartItemDialog = ({
  open,
  product,
  onOpenChange,
}: CreateCartItemDialogProps) => {
  const { createCartItemMutation } = useCartItems();
  const [openCartItemsSheet, setOpenCartItemsSheet] = useState(false);
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
      quantity: 1,
    },
  });

  const closeCreateCartItemDialog = () => {
    form.reset();

    onOpenChange(false);
  };

  const onSubmit = (values: z.infer<typeof createCartItemFormSchema>) => {
    createCartItemMutation.mutate({
      productId: product.id,
      formValues: values,
      closeCreateCartItemDialog,
      setOpenCartItemsSheet,
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Cart Item</DialogTitle>
            <DialogDescription>
              Enter a quantity between 1 and {product.quantity}.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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
              disabled={createCartItemMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              disabled={
                createCartItemMutation.isPending || !form.formState.isValid
              }
              onClick={() => submitButtonRef.current?.click()}
            >
              {createCartItemMutation.isPending ? (
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
