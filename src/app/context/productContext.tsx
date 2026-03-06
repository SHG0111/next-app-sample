"use client";
import {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { ProductType } from "@/utils/lib/types";
import axios from "axios";
import { fromUrlFormat, toUrlFormat } from "../../utils/lib/urlFormatter";
import { set } from "zod";

const API_KEY = "http://localhost:3000/api";

interface ProductContextType {
  products: ProductType[];
  getProducts: () => Promise<void>;
  error: string;
  getProductsByCategory: (category: string) => Promise<void>;
  loading: boolean;
  getProduct: (id: number, category: string) => Promise<void>;
  product: ProductType | null;
  deleteProduct: (productId: number, category: string) => Promise<void>;
  categories: string[];
  filteredProducts: ProductType[];
  addProduct: (productFormData: FormData) => Promise<ProductType>;
  setProducts: React.Dispatch<React.SetStateAction<ProductType[]>>;
  updateProduct: (
    id: number,
    category: string,
    productFormData: FormData,
  ) => Promise<ProductType>;
}

const ProductContext = createContext<ProductContextType | null>(null);

function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<ProductType | null>(null);
  const addProduct = useCallback(async (productFormData: FormData) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_KEY}/products`, productFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const createdProduct = res.data;
      setProducts((p) => [createdProduct, ...p]);

      setLoading(false);
      return createdProduct;
    } catch (error) {
      setError(`Failed to add product: ${error}`);
      setLoading(false);
    }
  }, []);

  const updateProduct = useCallback(
    async (id: number, category: string, productFormData: FormData) => {
      try {
        setLoading(true);
        const decodedCategory = fromUrlFormat(category);
        const response = await axios.put(
          `${API_KEY}/products/${decodedCategory}/${id}`,
          productFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
        const updatedProduct = response.data;
        setProduct(updatedProduct);
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? updatedProduct : p)),
        );
        setLoading(false);

        return updatedProduct;
      } catch (error) {
        console.error("Save failed:", error);
        alert("Failed to save changes");
      }
    },
    [],
  );

  const getProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_KEY}/products`);
      const data = res.data;

      setLoading(false);
      const uniqueCategories = Array.from(
        new Set(data.map((p: ProductType) => p.category)),
      ) as string[];
      setCategories(uniqueCategories);
      setProducts(data);
    } catch (error) {
      setError(`Failed to fetch products: ${error}`);
      setLoading(false);
    }
  }, []);

  const getProductsByCategory = useCallback(async (category: string) => {
    try {
      setLoading(true);
      const decodedCategory = fromUrlFormat(category);
      const res = await axios.get(`${API_KEY}/products/${decodedCategory}`);
      const data = res.data;
      if (!Array.isArray(data)) {
        setError("Invalid data format");
        setLoading(false);
        return;
      }

      data.length > 0
        ? setFilteredProducts(data)
        : setError(`No products found for ${decodedCategory}`);
    } catch (err) {
      setError(
        `Failed to fetch products for ${fromUrlFormat(category)}: ${err}`,
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const getProduct = useCallback(async (id: number, category: string) => {
    try {
      setLoading(true);
      const decodedCategory = fromUrlFormat(category);
      const res = await axios.get(
        `${API_KEY}/products/${decodedCategory}/${id}`,
      );
      setProduct(res.data);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch product");
      setLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(
    async (productId: number, category: string) => {
      try {
        setLoading(true);
        await axios.delete(`${API_KEY}/products/${category}/${productId}`);
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        setLoading(false);
      } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
      }
    },
    [],
  );

  const contextValue = useMemo(
    () => ({
      products,
      getProducts,
      error,
      getProductsByCategory,
      loading,
      getProduct,
      product,
      deleteProduct,
      categories,
      filteredProducts,
      addProduct,
      setProducts,
      updateProduct,
    }),
    [
      products,
      error,
      loading,
      product,
      categories,
      getProducts,
      getProductsByCategory,
      getProduct,
      deleteProduct,
      filteredProducts,
      addProduct,
      setProducts,
      updateProduct,
    ],
  );

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
}

export { ProductProvider, ProductContext };
