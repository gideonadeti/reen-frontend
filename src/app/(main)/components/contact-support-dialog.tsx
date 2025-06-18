import { Loader } from "lucide-react";

import useUser from "../hooks/use-user";
import { Muted } from "@/components/ui/typography";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ContactSupportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContactSupportDialog = ({ open, onOpenChange }: ContactSupportProps) => {
  const { userQuery } = useUser();
  const user = userQuery.data;
  const firstName = user?.name.split(" ")[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {userQuery.isPending ? (
          <div className="h-4/5 flex items-center justify-center">
            <Loader className="animate-spin" />
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Contact Support</DialogTitle>
            </DialogHeader>
            <Muted>
              Hi {firstName},<br />
              Sorry for experiencing an issue during checkout. If you have any
              questions or need assistance, please contact me at{" "}
              <span className="font-semibold text-foreground border px-1 rounded">
                gideonadeti0@gmail.com
              </span>{" "}
              and I&apos;ll be happy to help.
            </Muted>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContactSupportDialog;
