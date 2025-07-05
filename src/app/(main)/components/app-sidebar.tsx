"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ShoppingBag, ShoppingBasket, Store, User, Users } from "lucide-react";

import useUser from "../hooks/use-user";
import useProducts from "../products/hooks/use-products";
import useOrders from "../orders/hooks/use-orders";
import useUsers from "../users/hooks/use-users";
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

interface MenuItem {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const menuItems: MenuItem[] = [
  {
    href: "/profile",
    icon: <User />,
    label: "Profile",
  },
  {
    href: "/users",
    icon: <Users />,
    label: "Users",
  },
  {
    href: "/products",
    icon: <ShoppingBag />,
    label: "Products",
  },
  {
    href: "/products?mine=true",
    icon: <ShoppingBasket />,
    label: "My Products",
  },
  {
    href: "/orders",
    icon: <Store />,
    label: "Orders",
  },
];

const AppSidebar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { productsQuery } = useProducts();
  const { userQuery } = useUser();
  const { ordersQuery } = useOrders();
  const { usersQuery } = useUsers();
  const user = userQuery.data;
  let products = productsQuery.data || [];
  let users = usersQuery.data || [];
  users = users.filter((user) => user.role !== "ANONYMOUS"); // Filter out anonymous user
  const anonymousUser = users.find((user) => user.role === "ANONYMOUS");
  products = products.filter(
    (product) => product.adminId !== anonymousUser?.id
  ); // Filter out products from anonymous user
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
                      isActive={
                        pathname === "/products"
                          ? mine === "true"
                            ? item.label === "My Products"
                            : item.label === "Products"
                          : pathname === item.href
                      }
                    >
                      <Link href={item.href}>
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.label === "Users" && (
                      <SidebarMenuBadge>
                        {users.length > 99 ? "99+" : users.length}
                      </SidebarMenuBadge>
                    )}
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
                    {item.label === "My Products" && (
                      <SidebarMenuBadge>
                        {myProducts.length > 99 ? "99+" : myProducts.length}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                ))}
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
                <SidebarMenuItem>
                  <SidebarMenuButton asChild disabled={isNadmin}>
                    <Button
                      variant="outline"
                      onClick={() => setOpenCreateProductDialog(true)}
                    >
                      Create a product
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
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
