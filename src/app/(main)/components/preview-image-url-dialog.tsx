import Image from "next/image";

import { Dialog, DialogContent } from "@/components/ui/dialog";

interface PreviewImageUrlDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
}

const PreviewImageUrlDialog = ({
  open,
  onOpenChange,
  imageUrl,
}: PreviewImageUrlDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-1/4 h-1/2">
        <div>
          <Image
            src={imageUrl}
            alt="Generated image preview"
            fill
            className="object-cover"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewImageUrlDialog;
