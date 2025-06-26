"use client";

import { useSearchParams } from "next/navigation";

import useProducts from "../hooks/use-products";
import useUser from "../../hooks/use-user";
import useUsers from "../../users/hooks/use-users";
import Loading from "@/app/loading";
import ProductsTable from "../components/data-table/products-table";
import columns from "../components/data-table/columns";
import { H3 } from "@/components/ui/typography";

const ProductsPage = () => {
  const { productsQuery } = useProducts();
  const { userQuery } = useUser();
  const { usersQuery } = useUsers();
  const users = usersQuery.data || [];
  let products = productsQuery.data || [];
  const authUser = userQuery.data;
  const searchParams = useSearchParams();
  const adminId = searchParams.get("adminId");
  const user = users.find((user) => user.id === adminId);
  const isAuthUser = authUser?.id === adminId;
  products = products.filter((product) => product.adminId === adminId);

  if (productsQuery.isPending || userQuery.isPending || usersQuery.isPending) {
    return <Loading />;
  }

  return (
    <div className="p-4 pt-0 space-y-4">
      <H3>{isAuthUser ? "My " : `${user?.name}'s `}Products</H3>
      <div>
        <ProductsTable columns={columns} data={products} />
      </div>
    </div>
  );
};

export default ProductsPage;
