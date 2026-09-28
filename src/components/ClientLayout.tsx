"use client";

import React from "react";
import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { QuickViewModal } from "@/components/QuickViewModal";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col justify-between selection:bg-neutral-900 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <QuickViewModal />
      </div>
    </CartProvider>
  );
}
