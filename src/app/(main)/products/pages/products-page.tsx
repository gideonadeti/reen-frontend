"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

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
  const router = useRouter();
  const users = usersQuery.data || [];
  const anonymousUser = users.find((user) => user.role === "ANONYMOUS");
  let products = productsQuery.data || [];
  products = products.filter(
    (product) => product.adminId !== anonymousUser?.id
  ); // Filter out products of anonymous user

  const authUser = userQuery.data;
  const searchParams = useSearchParams();
  const adminId = searchParams.get("adminId");
  const mine = searchParams.get("mine");
  const user = users.find((user) => user.id === adminId);
  const isAuthUser = authUser?.id === adminId;

  if (productsQuery.isPending || userQuery.isPending || usersQuery.isPending) {
    return <Loading />;
  }

  if (isAuthUser) {
    router.replace("/products?mine=true");
  }

  if (adminId) {
    products = products.filter((product) => product.adminId === adminId);
  }

  if (mine) {
    products = products.filter((product) => product.adminId === authUser?.id);
  }

  if (adminId && !user) {
    toast.error("Invalid adminId");

    router.replace("/products");
  }

  return (
    <div className="p-4 pt-0 space-y-4">
      <H3>
        {adminId ? `${user?.name}'s ` : mine === "true" ? "My " : ""}Products
      </H3>
      <div>
        <ProductsTable columns={columns} data={products} />
      </div>
    </div>
  );
};

export default ProductsPage;
