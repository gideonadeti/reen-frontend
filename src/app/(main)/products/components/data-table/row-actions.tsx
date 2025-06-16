"use client";

import Link from "next/link";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import useUser from "@/app/(main)/hooks/use-user";
import DeleteConfirmationDialog from "@/app/(main)/components/delete-confirmation-dialog";
import CreateProductDialog from "@/app/(main)/components/create-product-dialog";
import { Product } from "../../types/product";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RowActionsProps<TData> {
  row: Row<TData>;
}

const RowActions = <TData,>({ row }: RowActionsProps<TData>) => {
  const { userQuery } = useUser();
  const [openDeleteConfirmationDialog, setOpenDeleteConfirmationDialog] =
    useState(false);
  const [openCreateProductDialog, setOpenCreateProductDialog] = useState(false);
  const user = userQuery.data;
  const product = row.original as Product;
  const isProductAdmin = product.adminId === user?.id;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="ms-1">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href={`/products/${product.id}`}>View product</Link>
          </DropdownMenuItem>
          {isProductAdmin && (
            <>
              <DropdownMenuItem
                onClick={() => setOpenCreateProductDialog(true)}
              >
                Update product
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setOpenDeleteConfirmationDialog(true)}
              >
                Delete product
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteConfirmationDialog
        open={openDeleteConfirmationDialog}
        subject={{ key: "Product", value: product }}
        onOpenChange={setOpenDeleteConfirmationDialog}
      />
      <CreateProductDialog
        open={openCreateProductDialog}
        onOpenChange={setOpenCreateProductDialog}
        product={product}
      />
    </>
  );
};

export default RowActions;
