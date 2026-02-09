"use client";

import type { ProductType } from "@/types";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Error from "@/app/products/error";
import axios from "axios";
import {
  fromUrlFormat,
  getCategoryFromUrl,
  toUrlFormat,
} from "@/app/lib/urlFormatter";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const ProductDetail = ({
  params,
}: {
  params: { id: number; category: string };
}) => {
  const [product, setProduct] = useState<ProductType | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const getProduct = async () => {
    try {
      const res = await axios.get(`${API_KEY}/products/${params.id}`);
      setProduct(res.data);
      setLoading(false);
    } catch {
      setError("Failed to fetch product");
      setLoading(false);
    }
  };
  useEffect(() => {
    getProduct();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  if (error) {
    return (
      <Error
        error={new globalThis.Error(error)}
        reset={() => window.location.reload()}
      />
    );
  }

  if (!product)
    return <div className="text-center py-10">Product not found</div>;

  return (
    <div className="max-w-6xl mx-auto my-auto h-96 p-6 bg-white rounded-lg ">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative  h-full w-full">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain drop-shadow-xl "
            priority
          />
        </div>
        <div className="flex flex-col gap-4">
          <Link href={`/products/category/${product.category}`}>
            <span
              className={`${
                product.category === "electronics"
                  ? "border-teal-500 text-teal-500 hover:bg-teal-200   hover:text-black transition-all"
                  : fromUrlFormat(product.category) === "men's clothing"
                    ? "border-yellow-600 text-yellow-700 hover:bg-yellow-100   hover:text-black transition-all"
                    : product.category === "women's clothing"
                      ? "border-pink-500 text-pink-500 hover:bg-pink-300   hover:text-black transition-all"
                      : product.category === "jewerlery"
                        ? "border-gray-200 text-gray-200 hover:bg-gray-200   hover:text-black transition-all"
                        : "border-black-500 text-black-500 hover:bg-slate-100   hover:text-black transition-all"
              } inline-flex items-center  px-2 py-1 font-semibold text-sm   text-gray-400 border border-gray-300  rounded-full inset-ring inset-ring-gray-500/10`}
            >
              {product.category}
            </span>
          </Link>
          <h1 className="text-2xl font-bold">{product.title}</h1>

          <div className="text-xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </div>
          {/* <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-blue-800/50 leading-relaxed">
              {product.description}
            </p>
          </div> */}
          <button className="mt-0 w-full box-bg">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
