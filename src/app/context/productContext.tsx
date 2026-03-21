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
import { ca } from "zod/v4/locales";
const API_KEY = "http://localhost:3000/api";

interface ProductContextType {
  products: ProductType[];
  getProducts: () => Promise<void>;
  loadMoreProducts: () => Promise<void>;
  error: string;
  hasMore: boolean;
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
  DownloadProductsAsCSVFile: () => Promise<void>;
  // addAllProducts: (products: any[]) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | null>(null);

function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<ProductType | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
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
  // const addAllProducts = useCallback(async (products: any[]) => {
  //   try {
  //     setLoading(true);
  //     const res = await axios.post(`${API_KEY}/products`, products);
  //     const createdProducts = res.data;
  //     setProducts((p) => [createdProducts, ...p]);
  //     console.log(createdProducts);
  //     setLoading(false);
  //     return createdProducts;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, []);
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
  const DownloadProductsAsCSVFile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_KEY}/export/products`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "products.csv"); // ✅ Set filename
      document.body.appendChild(link);
      link.click(); // ✅ Trigger download
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setLoading(false);
    } catch (error) {
      setError(`Failed download csv file: ${error}`);
      setLoading(false);
    }
  }, []);
  const PRODUCTS_PER_PAGE = 20;
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
      setAllProducts(data);
      setProducts(data.slice(0, PRODUCTS_PER_PAGE));
      setPage(1);
      setHasMore(data.length > PRODUCTS_PER_PAGE);
    } catch (error) {
      setError(`Failed to fetch products: ${error}`);
      setLoading(false);
    }
  }, []);
  const loadMoreProducts = useCallback(async () => {
    if (!hasMore || loading) return;

    try {
      setLoading(true);
      const nextPage = page + 1;
      const startIndex = (nextPage - 1) * PRODUCTS_PER_PAGE;
      const endIndex = startIndex + PRODUCTS_PER_PAGE;

      const newProducts = allProducts.slice(0, endIndex);
      setProducts(newProducts);
      setPage(nextPage);
      setHasMore(endIndex < allProducts.length);
    } catch (error) {
      setError(`Failed to load more products: ${error}`);
    } finally {
      setLoading(false);
    }
  }, [allProducts, page, hasMore, loading]);
  useEffect(() => {
    getProducts();
  }, [getProducts]);

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
      DownloadProductsAsCSVFile,
      loadMoreProducts,
      hasMore,
      // addAllProducts,
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
      DownloadProductsAsCSVFile,
      loadMoreProducts,
      hasMore,
      // addAllProducts,
    ],
  );

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
}

export { ProductProvider, ProductContext };
