"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Crown } from "lucide-react";

import RowActions from "./row-actions";
import Header from "@/app/(main)/components/data-table/header";
import formatMoney from "@/app/(main)/utils/format-money";
import formatDate from "@/app/(main)/orders/utils/format-date";
import { User } from "@/app/(main)/types/user";
import { Badge } from "@/components/ui/badge";

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <Header column={column} title="Name" />,
    cell: ({ row }) => {
      const user = row.original;

      return (
        <Link href={`/users/${user.id}`} className="hover:underline">
          {user.name}
        </Link>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => <Header column={column} title="Role" />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => {
      const user = row.original;
      const isAdmin = user.role === "ADMIN";

      return (
        <div>
          {isAdmin ? (
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-600 font-semibold shadow-md hover:from-yellow-600 hover:to-orange-800 transition-all duration-200">
              <Crown className="w-3 h-3" />
              ADMIN
            </Badge>
          ) : (
            <Badge className=" font-medium">NADMIN</Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "balance",
    header: ({ column }) => <Header column={column} title="Balance" />,
    cell: ({ row }) => {
      const user = row.original;

      return (
        <span className="ps-2 font-medium">{formatMoney(user.balance)}</span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <Header column={column} title="Date Joined" />,
    cell: ({ row }) => {
      const order = row.original;

      return (
        <span className="text-muted-foreground">
          {formatDate(order.createdAt)}
        </span>
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
