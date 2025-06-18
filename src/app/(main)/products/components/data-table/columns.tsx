"use client";

import { ColumnDef } from "@tanstack/react-table";

import Header from "@/app/(main)/components/data-table/header";
import { Product } from "../../types/product";
import ProductImagesPopover from "@/app/(main)/components/product-images-popover";
import NameAndQuantity from "../name-and-quantity";
import formatMoney from "@/app/(main)/utils/format-money";
import RowActions from "./row-actions";
import CustomLink from "@/components/ui/custom-link";
import Link from "next/link";

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <Header column={column} title="Name" />,
    cell: ({ row }) => {
      const product = row.original as Product;

      return (
        <div className="flex items-center gap-2">
          <ProductImagesPopover
            imageUrls={product.imageUrls}
            productName={product.name}
          />
          <Link href={`/products/${product.id}`} title="View product">
            <NameAndQuantity product={product} />
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => <Header column={column} title="Price" />,
    cell: ({ row }) => {
      const product = row.original as Product;

      return <div className="ps-4">{formatMoney(product.price)}</div>;
    },
  },
  {
    accessorKey: "admin.name",
    header: ({ column }) => <Header column={column} title="Admin's Name" />,
    cell: ({ row }) => {
      const product = row.original as Product;

      return (
        <CustomLink href={`/users/${product.admin.id}`}>
          {product.admin.name}
        </CustomLink>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <RowActions row={row} />,
  },
];

export default columns;
