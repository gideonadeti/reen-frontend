"use client";

import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { Eye, Loader, X } from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import useProducts from "../products/hooks/use-products";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  price: z.coerce
    .number()
    .min(1, { message: "Price must be a positive number" })
    .max(2000, { message: "Price must be less than 2000" }),
  quantity: z.coerce
    .number()
    .min(1, { message: "Quantity must be a positive number" })
    .max(2000, { message: "Quantity must be less than 2000" }),
  imageUrls: z
    .array(z.string())
    .min(1, { message: "At least one image URL is required" })
    .max(6, { message: "Maximum of 6 image URLs are allowed" }),
});

interface CreateProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateProductDialog = ({
  open,
  onOpenChange,
}: CreateProductDialogProps) => {
  const [generateCount, setGenerateCount] = useState(1);
  const [generatedImageUrls, setGeneratedImageUrls] = useState<string[]>([]);
  const [hasGeneratedImages, setHasGeneratedImages] = useState(false);
  const { createProductMutation } = useProducts();
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      quantity: 0,
      imageUrls: [],
    },
  });

  const generateImageUrls = useCallback((count: number) => {
    const newImageUrls = Array.from(
      { length: count },
      () => `https://robohash.org/${uuidv4()}`
    );

    setGeneratedImageUrls(newImageUrls);
    setHasGeneratedImages(true);
  }, []);

  const closeCreateProductDialog = useCallback(() => {
    form.reset();

    setGenerateCount(1);
    setGeneratedImageUrls([]);
    setHasGeneratedImages(false);

    onOpenChange(false);
  }, [form, onOpenChange]);

  // Only update form and trigger validation after images have been generated
  useEffect(() => {
    if (hasGeneratedImages) {
      form.setValue("imageUrls", generatedImageUrls);
      form.trigger("imageUrls");
    }
  }, [generatedImageUrls, hasGeneratedImages, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createProductMutation.mutate({
      formValues: values,
      closeCreateProductDialog,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Product</DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new product
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Dell Latitude 1234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="16GB RAM, 512GB ROM(SSD), Intel Core i7..."
                      className="resize-none h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={2000}
                        placeholder="400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={2000}
                        placeholder="10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Generate:</span>
                  <Select
                    value={generateCount.toString()}
                    onValueChange={(value) => setGenerateCount(Number(value))}
                  >
                    <SelectTrigger className="w-16" size="sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 6 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-sm">
                    image{generateCount > 1 ? " URLs" : " URL"}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => generateImageUrls(generateCount)}
                >
                  Generate
                </Button>
              </div>

              <FormField
                control={form.control}
                name="imageUrls"
                render={() => (
                  <FormItem>
                    <FormLabel>
                      Generated Image URLs ({generatedImageUrls.length}/6)
                    </FormLabel>
                    <FormControl>
                      {generatedImageUrls.length > 0 ? (
                        <ScrollArea className="h-32 border rounded-md">
                          <div className="flex flex-col gap-2 p-3">
                            {generatedImageUrls.map((imageUrl) => (
                              <GeneratedImageUrl
                                key={imageUrl}
                                generatedImageUrl={imageUrl}
                                setGeneratedImageUrls={setGeneratedImageUrls}
                              />
                            ))}
                          </div>
                        </ScrollArea>
                      ) : (
                        <div className="h-24 border rounded-md flex items-center justify-center text-muted-foreground">
                          <p className="text-sm">No images generated yet</p>
                        </div>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <button type="submit" className="hidden" ref={submitButtonRef} />
          </form>
        </Form>

        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={closeCreateProductDialog}
          >
            Cancel
          </Button>
          <Button
            onClick={() => submitButtonRef.current?.click()}
            disabled={!form.formState.isValid}
          >
            {createProductMutation.isPending ? (
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

export default CreateProductDialog;
