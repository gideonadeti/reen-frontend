"use client";

import { Loader } from "lucide-react";

import useUser from "../hooks/use-user";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import formatMoney from "../utils/format-money";

interface UpdateUserRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UPGRADE_COST = 160_000;

const UpdateUserRoleDialog = ({
  open,
  onOpenChange,
}: UpdateUserRoleDialogProps) => {
  const { userQuery, updateUserRoleMutation } = useUser();
  const user = userQuery.data;
  const isNadmin = user?.role === "NADMIN";
  const currentBalance = user?.balance ?? 0;
  const newBalance = currentBalance - UPGRADE_COST;
  const hasEnoughBalance = currentBalance >= UPGRADE_COST;

  const handleSubmit = () => {
    updateUserRoleMutation.mutate({
      role: isNadmin ? "ADMIN" : "NADMIN",
      onOpenChange,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isNadmin ? "Become an ADMIN" : "Step Down to NADMIN"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm text-muted-foreground">
          {isNadmin ? (
            <>
              <p>As an ADMIN, you can:</p>
              <ul className="list-disc pl-5">
                <li>Create new products</li>
                <li>Update existing products</li>
                <li>Delete your products</li>
              </ul>

              <p>
                When you create a product, others can buy it. The more people
                buy, the more you earn — but you&apos;re responsible for keeping
                enough quantity available to keep earning.
              </p>

              <p>
                <strong>Cost to become ADMIN:</strong>{" "}
                <span className="text-foreground font-semibold">
                  {formatMoney(UPGRADE_COST)}
                </span>
              </p>

              <div className="text-sm text-foreground border rounded p-3 space-y-1 bg-muted/30">
                <p>
                  <strong>Your balance: </strong>
                  {formatMoney(currentBalance)}
                </p>
                <p>
                  <strong>Remaining after upgrade:</strong>{" "}
                  {hasEnoughBalance ? (
                    `${formatMoney(newBalance)}`
                  ) : (
                    <span className="text-red-500">Insufficient funds</span>
                  )}
                </p>
              </div>

              <p>
                <strong>Note:</strong> Creating a product costs{" "}
                <span className="font-semibold">4%</span> of the product price ×
                quantity.
              </p>
              <p>
                Updating a product costs{" "}
                <span className="font-semibold">4%</span> of price increase ×
                quantity increase.
              </p>
            </>
          ) : (
            <p>
              You&apos;re about to step down from ADMIN status and return to
              NADMIN. You&apos;ll no longer be able to create, update, or delete
              products.
            </p>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              disabled={updateUserRoleMutation.isPending}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={
              updateUserRoleMutation.isPending ||
              (isNadmin && !hasEnoughBalance)
            }
          >
            {updateUserRoleMutation.isPending ? (
              <span className="flex items-center">
                <Loader className="animate-spin mr-2" />
                Submitting...
              </span>
            ) : isNadmin ? (
              "Become ADMIN"
            ) : (
              "Step Down"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserRoleDialog;
