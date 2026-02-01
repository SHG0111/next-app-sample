"use client";

import type { ProductType } from "@/types";
import { useEffect, useState } from "react";
import Product from "@/app/products/Product";
import Error from "../../error";
import { fromUrlFormat, getCategoryFromUrl } from "@/app/lib/urlFormatter";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const ItemCategory = ({ params }: { params: { category: string } }) => {
  const [categoryProducts, setCategoryProducts] = useState<ProductType[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function getPosts() {
      try {
        const res = await fetch(`${API_KEY}/products`);
        if (!res.ok) {
          setError(`Failed to fetch products: ${res.status}`);
        }
        const data = await res.json();
        const filtered = data.filter(
          (item: ProductType) =>
            getCategoryFromUrl(item.category) ===
            getCategoryFromUrl(params.category),
        );
        setCategoryProducts(filtered);
      } catch (error) {
        setError(`Failed to fetch products: ${error}`);
      } finally {
        setLoading(false);
      }
    }
    getPosts();
  }, [params.category]);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <>
      {error ? (
        <Error
          error={new globalThis.Error(error)}
          reset={() => window.location.reload()}
        />
      ) : (
        <div className="w-full">
          <div className="flex justify-center w-full">
            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 mb-2 gap-4 justify-center">
              {categoryProducts.map((item) => (
                <Product key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ItemCategory;
