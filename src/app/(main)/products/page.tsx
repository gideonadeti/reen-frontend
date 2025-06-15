"use client";

import useProducts from "./hooks/use-products";
import columns from "./components/data-table/columns";
import ProductsTable from "./components/data-table/products-table";
import Loading from "@/app/loading";
import { H3 } from "@/components/ui/typography";

const Page = () => {
  const { productsQuery } = useProducts();
  const products = productsQuery.data || [];

  if (productsQuery.isPending) {
    return <Loading />;
  }

  return (
    <div className="p-4 pt-0 space-y-4">
      <H3>Products</H3>
      <div>
        <ProductsTable columns={columns} data={products} />
      </div>
    </div>
  );
};

export default Page;
