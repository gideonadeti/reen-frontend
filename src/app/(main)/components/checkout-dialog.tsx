import { Loader, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";

import useGetAxios from "../hooks/use-get-axios";
import { Button } from "@/components/ui/button";
import { checkout } from "../utils/query-functions";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CheckoutDialog = ({ open, onOpenChange }: CheckoutDialogProps) => {
  const getAxios = useGetAxios();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const axios = await getAxios();
      const { stripeSessionUrl } = await checkout(axios);

      onOpenChange(false);

      window.location.href = stripeSessionUrl;
    } catch (error) {
      const message =
        ((error as AxiosError)?.response?.data as { message?: string })
          ?.message || "Failed to checkout";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyTestCardNumber = () => {
    navigator.clipboard.writeText("4242 4242 4242 4242");

    toast.success("Test card number copied to clipboard");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>
            Complete your purchase using the test card details below
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="bg-muted/30 rounded p-3">
            <p className="text-sm mb-2">
              <strong>Test Card:</strong>
            </p>
            <button
              onClick={copyTestCardNumber}
              className="font-mono bg-background border rounded px-2 py-1 text-sm hover:bg-accent flex items-center gap-2"
            >
              4242 4242 4242 4242
              <Copy className="h-3 w-3" />
            </button>
            <p className="text-xs text-muted-foreground mt-1">
              Use any future expiry and any 3-digit CVC
            </p>
          </div>

          <div className="text-sm space-y-2 text-muted-foreground">
            <p>
              When you click &quot;Submit&quot;, you&apos;ll be redirected to a
              Stripe page to complete payment.
            </p>
            <p>
              After payment, you&apos;ll return here and your order will be
              processed.
            </p>
            <p>A confirmation email will be sent to you.</p>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary" disabled={isSubmitting}>
              Cancel
            </Button>
          </DialogClose>
          <Button disabled={isSubmitting} onClick={handleSubmit}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader className="animate-spin" />
                Submitting...
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

export default CheckoutDialog;
