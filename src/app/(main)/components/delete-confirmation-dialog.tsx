import { Loader } from "lucide-react";

import useProducts from "../products/hooks/use-products";
import { Button } from "@/components/ui/button";
import { Product } from "../products/types/product";
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
  key: "Product";
  value: Product;
}

const DeleteConfirmationDialog = ({
  open,
  subject,
  onOpenChange,
}: DeleteConfirmationDialogProps) => {
  const { deleteProductMutation } = useProducts();

  const handleSubmit = () => {
    if (subject.key === "Product") {
      deleteProductMutation.mutate({ id: subject.value.id, onOpenChange });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {subject.key}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this {subject.key}? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild disabled={deleteProductMutation.isPending}>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={() => handleSubmit()}
            disabled={deleteProductMutation.isPending}
          >
            {deleteProductMutation.isPending ? (
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
