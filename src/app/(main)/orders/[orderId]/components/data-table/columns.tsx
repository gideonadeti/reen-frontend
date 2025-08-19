"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";

import Header from "@/app/(main)/components/data-table/header";
import { OrderItem } from "../../../types/order";
import ProductImagesPopover from "@/app/(main)/components/product-images-popover";
import formatMoney from "@/app/(main)/utils/format-money";
import { Muted } from "@/components/ui/typography";

const columns: ColumnDef<OrderItem>[] = [
  {
    accessorKey: "product.name",
    header: ({ column }) => <Header column={column} title="Product Name" />,
    cell: ({ row }) => {
      const orderItem = row.original as OrderItem;

      return (
        <div className="flex items-center gap-2">
          <ProductImagesPopover
            imageUrls={orderItem.product.imageUrls}
            productName={orderItem.product.name}
          />
          <Link
            href={`/products/${orderItem.product.id}`}
            title="View product"
            className="flex flex-col"
          >
            <span className="font-medium text-base">
              {orderItem.product.name}
            </span>
            <span className="text-muted-foreground">
              Available Qty: {orderItem.product.quantity}
            </span>
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <Header column={column} title="Quantity added to Cart" />
    ),
    cell: ({ row }) => {
      const orderItem = row.original as OrderItem;

      return <div className="ps-20">{orderItem.quantity}</div>;
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => <Header column={column} title="Sub Total" />,
    cell: ({ row }) => {
      const orderItem = row.original as OrderItem;
      const costPerItem = orderItem.price / orderItem.quantity;

      return (
        <div className="ps-4">
          <span>{formatMoney(orderItem.price)}</span>
          <Muted className="text-xs">{formatMoney(costPerItem)} each</Muted>
        </div>
      );
    },
  },
];

export default columns;
