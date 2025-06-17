"use client";

import { ColumnDef } from "@tanstack/react-table";

import Header from "@/app/(main)/components/data-table/header";
import formatMoney from "@/app/(main)/utils/format-money";
import RowActions from "./row-actions";
import { Order } from "../../types/order";
import formatDate from "../../utils/format-date";

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "total",
    header: ({ column }) => <Header column={column} title="Total Cost" />,
    cell: ({ row }) => {
      const order = row.original as Order;

      return <span className="ps-4">{formatMoney(order.total)}</span>;
    },
  },
  {
    accessorKey: "orderItems",
    header: ({ column }) => (
      <Header column={column} title="Number of Order Items" />
    ),
    cell: ({ row }) => {
      const order = row.original as Order;

      return <span className="ps-20">{order.orderItems.length}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <Header column={column} title="Created At" />,
    cell: ({ row }) => {
      const order = row.original as Order;

      return <span>{formatDate(order.createdAt)}</span>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <RowActions row={row} />,
  },
];

export default columns;
