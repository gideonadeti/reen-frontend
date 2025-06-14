"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";

import useUser from "../hooks/use-user";
import UpdateUserRoleDialog from "./update-user-role-dialog";
import CreateProductDialog from "./create-product-dialog";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
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
];

const AppSidebar = () => {
  const pathname = usePathname();
  const { userQuery } = useUser();
  const user = userQuery.data;
  const [openUpdateUserRoleDialog, setOpenUpdateUserRoleDialog] =
    useState(false);
  const [openCreateProductDialog, setOpenCreateProductDialog] = useState(false);
  const isNadmin = user?.role === "NADMIN";

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
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
                Become {user?.role === "ADMIN" ? "a NADMIN" : "an ADMIN"}
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <UpdateUserRoleDialog
        open={openUpdateUserRoleDialog}
        onOpenChange={setOpenUpdateUserRoleDialog}
      />
      <CreateProductDialog
        open={openCreateProductDialog}
        onOpenChange={setOpenCreateProductDialog}
      />
    </Sidebar>
  );
};

export default AppSidebar;
