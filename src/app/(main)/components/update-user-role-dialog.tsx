"use client";

import { useState } from "react";

import useUser from "../hooks/use-user";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader } from "lucide-react";

interface UpdateUserRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const REQUIRED_PHRASE = "I UNDERSTAND THE RISKS";

const UpdateUserRoleDialog = ({
  open,
  onOpenChange,
}: UpdateUserRoleDialogProps) => {
  const { userQuery, updateUserRoleMutation } = useUser();
  const user = userQuery.data;
  const [confirmationText, setConfirmationText] = useState("");
  const isNadmin = user?.role === "NADMIN";
  const isConfirmed = confirmationText.trim() === REQUIRED_PHRASE;

  const handleSubmit = () => {
    updateUserRoleMutation.mutate({
      role: isNadmin ? "ADMIN" : "NADMIN",
      setConfirmationText,
      onOpenChange,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Become {isNadmin ? "an ADMIN" : "a NADMIN"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isNadmin ? (
            <>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  You are about to request <strong>ADMIN</strong> privileges.
                </p>
                <p>With great power comes great responsibility.</p>

                <p>As an ADMIN, you will be able to:</p>
                <ul className="list-disc pl-5">
                  <li>Create new products</li>
                  <li>Update your existing products</li>
                  <li>Delete your products</li>
                </ul>

                <p className="mt-2">
                  To proceed, please type{" "}
                  <span className="font-semibold text-foreground border px-1 rounded">
                    {REQUIRED_PHRASE}
                  </span>{" "}
                  in the input below:
                </p>
              </div>

              <Input
                placeholder="Type the phrase exactly..."
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
              />
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              You are about to step down from ADMIN privileges and return to
              NADMIN status.
            </p>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button
            disabled={
              (isNadmin && !isConfirmed) || updateUserRoleMutation.isPending
            }
            onClick={handleSubmit}
          >
            {updateUserRoleMutation.isPending ? (
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

export default UpdateUserRoleDialog;
