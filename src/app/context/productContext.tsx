"use client";
import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { ProductType } from "@/utils/lib/types";
import axios from "axios";
import { fromUrlFormat } from "../../utils/lib/urlFormatter";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

interface ProductContextType {
  products: ProductType[];
  getProducts: () => Promise<void>;
  error: string;
  getProductsByCategory: (category: string) => Promise<void>;
  loading: boolean;
  getProduct: (id: number) => Promise<void>;
  product: ProductType | null;
  deleteProduct: (productId: number) => Promise<void>;
  categories: string[];
}

const ProductContext = createContext<ProductContextType | null>(null);

function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<ProductType | null>(null);

  const getProducts = async () => {
    try {
      const res = await axios.get(`${API_KEY}/products`);

      const data = await res.data;
      setLoading(false);
      const uniqueCategories = Array.from(
        new Set(data.map((p: ProductType) => p.category)),
      ) as string[];
      setCategories(uniqueCategories);
      return setProducts(data);
    } catch (error) {
      setError(`Failed to fetch products: ${error}`);
    } finally {
    }
  };

  async function getProductsByCategory(category: string) {
    try {
      const decodedCategory = fromUrlFormat(category);
      const res = await axios.get(`${API_KEY}/products`);
      const data = res.data;
      data === null &&
        setError(
          `Failed to fetch products for ${decodedCategory}: ${res.status}`,
        );
      const filtered = data.filter(
        (product: ProductType) =>
          fromUrlFormat(product.category) === decodedCategory,
      );
      const filterArray = Array.from(new Set(filtered)) as ProductType[];
      filterArray.length > 0
        ? setProducts(filterArray)
        : setError(`No products found for ${decodedCategory}`);
    } catch (err) {
      setError(
        `Failed to fetch products for ${fromUrlFormat(category)}: ${err}`,
      );
    } finally {
      setLoading(false);
    }
  }
  const getProduct = async (id: number) => {
    try {
      const res = await axios.get(`${API_KEY}/products/${id}`);
      setProduct(res.data);
      setLoading(false);
    } catch {
      setError("Failed to fetch product");
      setLoading(false);
    }
  };
  const deleteProduct = async (productId: number) => {
    try {
      const response = await axios.delete(`${API_KEY}/products/${productId}`);
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  };
  useEffect(() => {
    getProducts();
  }, []);
  return (
    <ProductContext.Provider
      value={
        {
          products,
          getProducts,
          error,
          getProductsByCategory,
          loading,
          getProduct,
          product,
          deleteProduct,

          categories,
        } as unknown as ProductContextType
      }
    >
      {children}
    </ProductContext.Provider>
  );
}

export { ProductProvider, ProductContext };
