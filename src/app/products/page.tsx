"use client";

import type { ProductType } from "@/types/index";
import { useEffect, useState } from "react";
import Product from "@/app/products/Product";
import Error from "./error";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const Productspage = () => {
  const [post, setPost] = useState<ProductType[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getPosts() {
      try {
        const res = await fetch(`${API_KEY}/products`);
        if (!res.ok) {
          setError(`Failed to fetch products: ${res.status}`);
        }
        const data = await res.json();
        setPost(data);
      } catch (error) {
        setError(`Failed to fetch products: ${error}`);
      } finally {
      }
    }
    getPosts();
  }, []);
  return (
    <>
      {error ? (
        <div>
          <Error
            error={new globalThis.Error(error)}
            reset={() => window.location.reload()}
          />
        </div>
      ) : (
        <div className="flex  justify-center  w-full">
          <div className="grid  lg:grid-cols-4 md:grid-cols-2 grid-cols-1 mb-2  gap-4  justify-center">
            {post.map((item) => {
              return <Product key={item.id} item={item} />;
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default Productspage;
