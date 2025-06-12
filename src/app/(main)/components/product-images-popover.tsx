import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ProductImagesPopoverProps {
  productName: string;
  imageUrls: string[];
}

const ProductImagesPopover = ({
  productName,
  imageUrls,
}: ProductImagesPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger className="relative w-16 h-16">
        <Image
          src={imageUrls[0]}
          alt={`Image of ${productName}`}
          className="rounded object-cover"
          fill // Instead of width & height, let the parent handle sizing
        />
        {imageUrls.length > 1 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <p className="text-white">+{imageUrls.length - 1}</p>
          </div>
        )}
      </PopoverTrigger>

      <PopoverContent>
        <div className="grid grid-cols-3 gap-2">
          {imageUrls.map((imageUrl, index) => (
            <div key={index} className="relative h-32">
              <Image
                src={imageUrl}
                alt={`Image of ${productName}`}
                className="rounded object-cover"
                fill
              />
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProductImagesPopover;
