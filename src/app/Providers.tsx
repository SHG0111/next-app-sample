"use client";

import { ProductProvider } from "./context/productContext";
import { ToastContainer } from "react-toastify";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./context/authContext";
import { CartProvider } from "./context/cartContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ProductProvider>
      <AuthProvider>
        <CartProvider>
          <ToastContainer />
          <TooltipProvider>{children}</TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </ProductProvider>
  );
}
