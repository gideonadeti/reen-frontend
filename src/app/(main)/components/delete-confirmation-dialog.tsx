import { Loader } from "lucide-react";

import useProducts from "../products/hooks/use-products";
import useCartItems from "../hooks/use-cart-items";
import { Button } from "@/components/ui/button";
import { Product } from "../products/types/product";
import { CartItem } from "../types/cart-item";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteConfirmationDialogProps {
  open: boolean;
  subject: Subject;
  onOpenChange: (open: boolean) => void;
}

interface Subject {
  key: "Product" | "Cart-Item";
  value: Product | CartItem;
}

const DeleteConfirmationDialog = ({
  open,
  subject,
  onOpenChange,
}: DeleteConfirmationDialogProps) => {
  const { deleteProductMutation } = useProducts();
  const { deleteCartItemMutation } = useCartItems();
  const isSubmitting =
    deleteProductMutation.isPending || deleteCartItemMutation.isPending;

  const handleSubmit = () => {
    if (subject.key === "Product") {
      deleteProductMutation.mutate({ id: subject.value.id, onOpenChange });
    } else if (subject.key === "Cart-Item") {
      deleteCartItemMutation.mutate({
        id: subject.value.id,
        onOpenChange,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete {subject.key === "Cart-Item" ? "Cart Item" : subject.key}
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this{" "}
            {subject.key === "Cart-Item" ? "cart item" : "product"}? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild disabled={isSubmitting}>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={() => handleSubmit()} disabled={isSubmitting}>
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
  );
};

export default DeleteConfirmationDialog;
