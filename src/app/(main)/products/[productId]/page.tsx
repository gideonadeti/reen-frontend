"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { useState } from "react";

import formatMoney from "../../utils/format-money";
import useProducts from "../hooks/use-products";
import useUsers from "../../users/hooks/use-users";
import useUser from "../../hooks/use-user";
import Loading from "@/app/loading";
import ProductImagesCarousel from "./components/product-images-carousel";
import CreateCartItemDialog from "./components/create-cart-item-dialog";
import { Product } from "../types/product";
import { H1, H3, Muted } from "@/components/ui/typography";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const Page = () => {
  const { productId } = useParams();
  const { productsQuery } = useProducts();
  const { userQuery } = useUser();
  const { usersQuery } = useUsers();
  const users = usersQuery.data || [];
  const anonymousUser = users.find((user) => user.role === "ANONYMOUS");
  const [openCreateCartItemDialog, setOpenCreateCartItemDialog] =
    useState(false);

  const router = useRouter();
  const user = userQuery.data;
  const product = productsQuery.data?.find((p) => p.id === productId);
  const productAdminId = product?.adminId;
  const adminProducts = productsQuery.data?.filter(
    (p) => p.adminId === productAdminId
  );

  const otherProducts = adminProducts?.filter((p) => p.id !== productId) || [];
  const adminIsCurrentUser = user?.id === productAdminId;
  const adminIsAnonymousUser = productAdminId === anonymousUser?.id;

  if (productsQuery.isPending || userQuery.isPending || usersQuery.isPending) {
    return <Loading />;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <>
      <div className="pb-4 px-4">
        <Button
          variant="outline"
          className="mt-2"
          onClick={() => router.back()}
          title="Back"
        >
          <ArrowLeft />
        </Button>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <ProductImagesCarousel imageUrls={product.imageUrls || []} />
          </div>

          <div className="flex flex-col divide-y">
            <div className="pb-4">
              <H1>{product.name}</H1>
              <span className="bg-blue-600 rounded-full font-medium px-3 py-1">
                {formatMoney(product.price)}
              </span>
            </div>

            <div className="py-4">
              <Muted className="text-sm">{product.description}</Muted>
            </div>

            <div className="mt-auto">
              <Button
                variant="ghost"
                onClick={() => setOpenCreateCartItemDialog(true)}
                className="relative bg-blue-600 cursor-pointer rounded-full h-12 font-medium px-3 w-full flex items-center justify-center"
                disabled={
                  adminIsCurrentUser ||
                  product.quantity < 1 ||
                  adminIsAnonymousUser
                }
              >
                <Plus className="absolute left-4 w-4 h-4" />
                <span>Add To Cart</span>
              </Button>
            </div>
          </div>
        </div>

        {otherProducts?.length > 0 && (
          <div className="mt-8 max-w-4xl mx-auto">
            <H3>
              Other Products of{" "}
              <Link
                href={`/users/${user?.id}`}
                className="hover:text-muted-foreground"
              >
                {adminIsCurrentUser ? "You" : product.admin.name}
              </Link>
            </H3>
            <OtherProducts otherProducts={otherProducts} />
          </div>
        )}
      </div>
      <CreateCartItemDialog
        open={openCreateCartItemDialog}
        product={product}
        onOpenChange={setOpenCreateCartItemDialog}
      />
    </>
  );
};

const OtherProducts = ({ otherProducts }: { otherProducts: Product[] }) => {
  return (
    <ScrollArea className="rounded-md border">
      <div className="flex space-x-4 p-4">
        {otherProducts.map((otherProduct) => (
          <OtherProduct key={otherProduct.id} otherProduct={otherProduct} />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

const OtherProduct = ({ otherProduct }: { otherProduct: Product }) => {
  return (
    <Link
      href={`/products/${otherProduct.id}`}
      className="relative w-48 h-48 shrink-0 group cursor-pointer rounded-lg overflow-hidden"
    >
      <Image
        src={otherProduct.imageUrls[0] || "/placeholder.svg"}
        alt={`Image of ${otherProduct.name}`}
        fill
        className="object-cover transition-transform group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-black/20" />

      <div className="absolute bottom-1 left-2 right-2">
        <div className="flex items-center rounded-full border backdrop-blur-xs p-1 text-xs font-semibold">
          <span className="mr-2 flex-grow pl-1">
            {otherProduct.name.length > 15
              ? `${otherProduct.name.substring(0, 15)}...`
              : otherProduct.name}
          </span>
          <span className="flex-none rounded-full bg-blue-600 px-2 py-1">
            {formatMoney(otherProduct.price)}
          </span>
        </div>
      </div>
    </Link>
  );
};
export default Page;
