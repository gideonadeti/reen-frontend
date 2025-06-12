"use client";

import { Row } from "@tanstack/react-table";

import { Product } from "../../types/product";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

interface RowActionsProps<TData> {
  row: Row<TData>;
}

const RowActions = <TData,>({ row }: RowActionsProps<TData>) => {
  const product = row.original as Product;

  return (
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
        <DropdownMenuItem>Update product</DropdownMenuItem>
        <DropdownMenuItem>Delete product</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RowActions;
