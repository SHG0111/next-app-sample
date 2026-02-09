import { useContext } from "react";
import { ProductContext } from "../context/productContext";

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used inside ProductProvider");
  }
  return context;
}

export default useProducts;
