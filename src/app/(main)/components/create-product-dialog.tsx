"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { Loader } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";

import formatMoney from "../utils/format-money";
import useProducts from "../products/hooks/use-products";
import useUser from "../hooks/use-user";
import GeneratedImageUrl from "./generated-image-url";
import { getCreateProductFee, getUpdateProductFee } from "../utils/fees";
import { Product } from "../products/types/product";
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

export const createProductFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  price: z.coerce
    .number()
    .min(1, { message: "Price must be a positive number" })
    .max(2000, { message: "Price must be less than 2000" }),
  quantity: z.coerce
    .number()
    .int({ message: "Quantity must be an integer" })
    .min(1, { message: "Quantity must be a positive number" })
    .max(2000, { message: "Quantity must be less than 2000" }),
  imageUrls: z
    .array(z.string())
    .min(1, { message: "At least one image URL is required" })
    .max(6, { message: "Maximum of 6 image URLs are allowed" }),
});

interface CreateProductDialogProps {
  open: boolean;
  product?: Product;
  onOpenChange: (open: boolean) => void;
}

const CreateProductDialog = ({
  open,
  product,
  onOpenChange,
}: CreateProductDialogProps) => {
  const [generateCount, setGenerateCount] = useState(1);
  const [generatedImageUrls, setGeneratedImageUrls] = useState<string[]>(
    product?.imageUrls || []
  );
  const [hasGeneratedImages, setHasGeneratedImages] = useState(
    !!product || false
  );
  const { createProductMutation, updateProductMutation } = useProducts();
  const { userQuery } = useUser();
  const user = userQuery.data;
  const currentBalance = user?.balance ?? 0;
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const form = useForm<z.infer<typeof createProductFormSchema>>({
    resolver: zodResolver(createProductFormSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 1,
      quantity: product?.quantity || 1,
      imageUrls: product?.imageUrls || [],
    },
  });

  // Watch all form values for changes
  const watchedValues = form.watch();
  const createProductFee = getCreateProductFee(
    watchedValues.price,
    watchedValues.quantity
  );

  const updateProductFee = product
    ? getUpdateProductFee(
        product.price,
        product.quantity,
        watchedValues.price,
        watchedValues.quantity
      )
    : 0;

  const newBalance =
    currentBalance - (product ? updateProductFee : createProductFee);

  const hasEnoughBalance =
    currentBalance >= (product ? updateProductFee : createProductFee);

  // Memoized change detection
  const isUpdated = useMemo(() => {
    if (!product) return true; // Always allow submit for create mode

    return (
      watchedValues.name !== product.name ||
      watchedValues.description !== product.description ||
      Number(watchedValues.price) !== Number(product.price) ||
      Number(watchedValues.quantity) !== Number(product.quantity) ||
      JSON.stringify(watchedValues.imageUrls) !==
        JSON.stringify(product.imageUrls)
    );
  }, [watchedValues, product]);

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

  // Reset form when product changes or dialog opens
  useEffect(() => {
    if (open) {
      const defaultValues = {
        name: product?.name || "",
        description: product?.description || "",
        price: product?.price || 1,
        quantity: product?.quantity || 1,
        imageUrls: product?.imageUrls || [],
      };

      form.reset(defaultValues);
      setGeneratedImageUrls(product?.imageUrls || []);
    }
  }, [open, product, form]);

  // Only update form and trigger validation after images have been generated
  useEffect(() => {
    if (
      hasGeneratedImages ||
      (product && generatedImageUrls.length !== product.imageUrls.length)
    ) {
      form.setValue("imageUrls", generatedImageUrls);
      form.trigger("imageUrls");
    }
  }, [generatedImageUrls, hasGeneratedImages, form, product]);

  const onSubmit = (values: z.infer<typeof createProductFormSchema>) => {
    if (!product) {
      createProductMutation.mutate({
        formValues: values,
        closeCreateProductDialog,
      });
    } else {
      updateProductMutation.mutate({
        formValues: values,
        id: product.id,
        closeCreateProductDialog,
      });
    }
  };

  const isSubmitting =
    createProductMutation.isPending || updateProductMutation.isPending;
  const isSubmitDisabled =
    !form.formState.isValid || isSubmitting || (product && !isUpdated);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[96vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{product ? "Update" : "Create"} a Product</DialogTitle>
          <DialogDescription>
            {product
              ? "Modify the form below to update this product"
              : "Fill out the form below to create a new product"}
          </DialogDescription>
        </DialogHeader>

        {/* Fee Information - Always visible */}
        <div className="space-y-2 border-b pb-2">
          {product ? (
            <div>
              <strong>Update product fee:</strong>{" "}
              <span className="font-semibold">
                {formatMoney(updateProductFee)}
              </span>
            </div>
          ) : (
            <div>
              <strong>Create product fee:</strong>{" "}
              <span className="font-semibold">
                {formatMoney(createProductFee)}
              </span>
            </div>
          )}

          <div className="text-sm border rounded p-3 space-y-1 bg-muted/30">
            <p>
              <strong>Your balance: </strong>
              {formatMoney(currentBalance)}
            </p>
            <p>
              <strong>Remaining after {product ? "update" : "create"}:</strong>{" "}
              {hasEnoughBalance ? (
                `${formatMoney(newBalance)}`
              ) : (
                <span className="text-red-500">Insufficient funds</span>
              )}
            </p>
          </div>
        </div>

        {/* Form - Scrollable */}
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="pl-1 pr-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                    }
                  }}
                >
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
                            className="resize-none h-20"
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
                          onValueChange={(value) =>
                            setGenerateCount(Number(value))
                          }
                        >
                          <SelectTrigger className="w-16" size="sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 6 }, (_, i) => (
                              <SelectItem
                                key={i + 1}
                                value={(i + 1).toString()}
                              >
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
                            Image URLs ({generatedImageUrls.length}/6)
                          </FormLabel>
                          <FormControl>
                            {generatedImageUrls.length > 0 ? (
                              <ScrollArea className="h-32 border rounded-md">
                                <div className="p-2 space-y-2">
                                  {generatedImageUrls.map((imageUrl) => (
                                    <GeneratedImageUrl
                                      key={imageUrl}
                                      generatedImageUrl={imageUrl}
                                      setGeneratedImageUrls={
                                        setGeneratedImageUrls
                                      }
                                    />
                                  ))}
                                </div>
                              </ScrollArea>
                            ) : (
                              <div className="h-20 border rounded-md flex items-center justify-center text-muted-foreground">
                                <p className="text-sm">
                                  No images generated yet
                                </p>
                              </div>
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <button
                    type="submit"
                    className="hidden"
                    ref={submitButtonRef}
                  />
                </form>
              </Form>
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={closeCreateProductDialog}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={() => submitButtonRef.current?.click()}
            disabled={isSubmitDisabled}
          >
            {isSubmitting ? (
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

export default CreateProductDialog;
