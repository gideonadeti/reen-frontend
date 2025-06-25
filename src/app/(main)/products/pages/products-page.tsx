"use client";

import { useSearchParams } from "next/navigation";

import useProducts from "../hooks/use-products";
import useUser from "../../hooks/use-user";
import Loading from "@/app/loading";
import ProductsTable from "../components/data-table/products-table";
import columns from "../components/data-table/columns";
import { H3 } from "@/components/ui/typography";

const ProductsPage = () => {
  const { productsQuery } = useProducts();
  const { userQuery } = useUser();
  let products = productsQuery.data || [];
  const user = userQuery.data;
  const searchParams = useSearchParams();
  const mine = searchParams.get("mine");

  if (mine === "true") {
    products = products.filter((product) => product.adminId === user?.id);
  }

  if (productsQuery.isPending) {
    return <Loading />;
  }

  return (
    <div className="p-4 pt-0 space-y-4">
      <H3>{mine === "true" ? "My " : ""}Products</H3>
      <div>
        <ProductsTable columns={columns} data={products} />
      </div>
    </div>
  );
};

export default ProductsPage;
