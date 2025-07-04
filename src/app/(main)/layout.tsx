"use client";

import AppSidebar from "./components/app-sidebar";
import Header from "./components/header";
import QCProvider from "./components/q-c-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <QCProvider>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
        </div>
      </SidebarProvider>
      <Toaster richColors />
    </QCProvider>
  );
};

export default Layout;
