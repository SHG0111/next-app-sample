"use client";

import { ProductProvider } from "./context/productContext";
import { ToastContainer } from "react-toastify";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./context/authContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ProductProvider>
      <AuthProvider>
        <ToastContainer />
        <TooltipProvider>{children}</TooltipProvider>
      </AuthProvider>
    </ProductProvider>
  );
}
