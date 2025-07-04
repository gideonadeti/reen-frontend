import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { Eye, X } from "lucide-react";

import PreviewImageUrlDialog from "./preview-image-url-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface GeneratedImageUrlProps {
  generatedImageUrl: string;
  setGeneratedImageUrls: Dispatch<SetStateAction<string[]>>;
}

const GeneratedImageUrl = ({
  generatedImageUrl,
  setGeneratedImageUrls,
}: GeneratedImageUrlProps) => {
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);

  const removeGeneratedImageUrl = useCallback(() => {
    setGeneratedImageUrls((prev) =>
      prev.filter((imageUrl) => imageUrl !== generatedImageUrl)
    );
  }, [generatedImageUrl, setGeneratedImageUrls]);

  return (
    <>
      <div className="flex items-center gap-2">
        <Input readOnly value={generatedImageUrl} className="flex-1 text-xs" />
        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setOpenPreviewDialog(true)}
          >
            <Eye />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={removeGeneratedImageUrl}
          >
            <X />
          </Button>
        </div>
      </div>

      <PreviewImageUrlDialog
        open={openPreviewDialog}
        onOpenChange={setOpenPreviewDialog}
        imageUrl={generatedImageUrl}
      />
    </>
  );
};

export default GeneratedImageUrl;
