"use client";

import AppSidebar from "./components/app-sidebar";
import Header from "./components/header";
import { SidebarProvider } from "@/components/ui/sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
