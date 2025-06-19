"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ShoppingBag, ShoppingBasket, Store, User } from "lucide-react";

import useUser from "../hooks/use-user";
import useProducts from "../products/hooks/use-products";
import useOrders from "../orders/hooks/use-orders";
import UpdateUserRoleDialog from "./update-user-role-dialog";
import CreateProductDialog from "./create-product-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useState } from "react";

interface MenuItem {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const menuItems: MenuItem[] = [
  {
    href: "/products",
    icon: <ShoppingBag />,
    label: "Products",
  },
  {
    href: "/orders",
    icon: <Store />,
    label: "Orders",
  },
  {
    href: "/profile",
    icon: <User />,
    label: "Profile",
  },
];

const AppSidebar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { productsQuery } = useProducts();
  const { userQuery } = useUser();
  const { ordersQuery } = useOrders();
  const user = userQuery.data;
  const products = productsQuery.data || [];
  const myProducts = products.filter((product) => product.adminId === user?.id);
  const orders = ordersQuery.data || [];
  const isNadmin = user?.role === "NADMIN";
  const mine = searchParams.get("mine");
  const [openUpdateUserRoleDialog, setOpenUpdateUserRoleDialog] =
    useState(false);
  const [openCreateProductDialog, setOpenCreateProductDialog] = useState(false);

  return (
    <>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href && mine !== "true"}
                    >
                      <Link href={item.href}>
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.label === "Products" && (
                      <SidebarMenuBadge>
                        {products.length > 99 ? "99+" : products.length}
                      </SidebarMenuBadge>
                    )}
                    {item.label === "Orders" && (
                      <SidebarMenuBadge>
                        {orders.length > 99 ? "99+" : orders.length}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                ))}
                {!isNadmin && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/products" && mine === "true"}
                    >
                      <Link href="/products?mine=true">
                        <ShoppingBasket />
                        <span>My Products</span>
                      </Link>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>
                      {myProducts.length > 99 ? "99+" : myProducts.length}
                    </SidebarMenuBadge>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            {userQuery.isPending ? (
              <>
                {Array.from({ length: 2 }).map((_, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton asChild>
                      <Skeleton />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </>
            ) : (
              <>
                {!isNadmin && (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Button
                        variant="outline"
                        onClick={() => setOpenCreateProductDialog(true)}
                      >
                        Create a product
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Button
                      variant="outline"
                      onClick={() => setOpenUpdateUserRoleDialog(true)}
                    >
                      Become {!isNadmin ? "a NADMIN" : "an ADMIN"}
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
            )}
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <UpdateUserRoleDialog
        open={openUpdateUserRoleDialog}
        onOpenChange={setOpenUpdateUserRoleDialog}
      />
      <CreateProductDialog
        open={openCreateProductDialog}
        onOpenChange={setOpenCreateProductDialog}
      />
    </>
  );
};

export default AppSidebar;
