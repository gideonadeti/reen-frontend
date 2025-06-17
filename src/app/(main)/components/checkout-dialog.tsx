import { Loader } from "lucide-react";
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>
            Read the instructions below and proceed with the checkout process
            when ready.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <p>
            When you click submit, you&apos;ll be redirected to a Stripe-powered
            page to complete payment. Since this is a portfolio project, use the
            test card:
            <span
              className="font-semibold text-foreground border px-1 rounded ml-1"
              onClick={() => {
                navigator.clipboard.writeText("4242 4242 4242 4242");
              }}
              title="Click to copy test card number"
            >
              4242 4242 4242 4242
            </span>
            . Use any future expiry and any 3-digit CVC.
          </p>
          <p>
            After payment, you&apos;ll return to a success page. The cart will
            be cleared, the product quantity updated, and an order created. This
            may take a few seconds.
          </p>
          <p>
            An email will also be sent confirming the delivery is on its way.
            And...that&apos;s it 😊.
          </p>
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
