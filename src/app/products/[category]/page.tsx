"use client";

import type { ProductType } from "@/types/index";
import { useEffect, useState, use } from "react";
import Product from "@/app/products/Product";
import Error from "@/app/products/error";
import { fromUrlFormat } from "@/app/lib/urlFormatter";
import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const CategoryPage = ({ params }: { params: { category: string } }) => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function getProductsByCategory() {
    try {
      const decodedCategory = fromUrlFormat(params.category);
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
      setError(`Failed to fetch products for ${params.category}: ${err}`);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getProductsByCategory();
  }, []);

  if (loading) {
    return <div className="text-center p-10">Loading products...</div>;
  }

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
        <div className="flex flex-col items-center w-full">
          <h1 className="text-3xl font-bold my-8 capitalize">
            {fromUrlFormat(params.category)}
          </h1>
          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 mb-2 gap-4 justify-center">
            {products.map((item) => (
              <Product key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryPage;
