"use client";

import useOrders from "./hooks/use-orders";
import columns from "./components/data-table/columns";
import OrdersTable from "./components/data-table/orders-table";
import Loading from "@/app/loading";
import { H3 } from "@/components/ui/typography";

const Page = () => {
  const { ordersQuery } = useOrders();
  const orders = ordersQuery.data || [];

  if (ordersQuery.isPending) {
    return <Loading />;
  }

  return (
    <div className="p-4 pt-0 space-y-4">
      <H3>Orders</H3>
      <div>
        <OrdersTable columns={columns} data={orders} />
      </div>
    </div>
  );
};

export default Page;
