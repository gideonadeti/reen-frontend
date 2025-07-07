"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import useOrders from "../hooks/use-orders";
import Loading from "@/app/loading";
import columns from "./components/data-table/columns";
import OrderItemsTable from "./components/data-table/order-items-table";
import { H3 } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

const Page = () => {
  const { orderId } = useParams();
  const { ordersQuery } = useOrders();
  const router = useRouter();
  const order = ordersQuery.data?.find((o) => o.id === orderId);
  const orderItems = order?.orderItems || [];

  if (ordersQuery.isPending) {
    return <Loading />;
  }

  if (!order) {
    return (
      <div className="p-4 pt-0 h-full flex items-center justify-center">
        <H3>
          Order with id {orderId} not found{}
        </H3>
      </div>
    );
  }

  return (
    <div className="p-4 pt-0 space-y-4">
      <Button
        variant="outline"
        className="mt-2"
        onClick={() => router.back()}
        title="Back"
      >
        <ArrowLeft />
      </Button>
      <H3>
        Order{" "}
        <span className="font-semibold text-foreground border px-1 rounded">
          {order?.id}
        </span>
      </H3>
      <div>
        <OrderItemsTable columns={columns} data={orderItems} />
      </div>
    </div>
  );
};

export default Page;
