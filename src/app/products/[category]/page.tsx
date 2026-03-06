"use client";

import Product from "@/app/products/Product";
import Error from "@/app/products/error";
import { fromUrlFormat, toUrlFormat } from "@/utils/lib/urlFormatter";
import useProducts from "@/app/hooks/useProducts";
import CategoryLoading from "./loading";
import { useEffect } from "react";

const CategoryPage = ({ params }: { params: { category: string } }) => {
  const { getProductsByCategory, error, loading, filteredProducts } =
    useProducts();
  useEffect(() => {
    getProductsByCategory(params.category);
  }, [getProductsByCategory, params.category]);
  if (loading) {
    return <CategoryLoading />;
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
            {filteredProducts.map((item) => (
              <Product key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryPage;
