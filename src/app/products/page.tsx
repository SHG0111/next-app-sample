"use client";
import Product from "@/app/products/Product";
import Error from "./error";
import useProducts from "../hooks/useProducts";
import { useEffect } from "react";
import CategorySlider from "@/components/categorySlider/page";
import Loading from "./loading";
import SpinnerLoading from "@/app/(auth)/callback/loading";
import { useLazyLoad } from "../hooks/useLazyload";
const Productspage = () => {
  const { products, error, loading, getProducts, loadMoreProducts, hasMore } =
    useProducts();
  const { observerTarget, isLoading } = useLazyLoad(loadMoreProducts);

  return (
    <>
      {error ? (
        <div>
          <Error
            error={new globalThis.Error(error)}
            reset={() => window.location.reload()}
          />
        </div>
      ) : isLoading ? (
        <Loading />
      ) : (
        <>
          <CategorySlider />

          <div className="flex  justify-center  w-full">
            <div className="grid  lg:grid-cols-4 md:grid-cols-2 grid-cols-1 mb-2  gap-4  justify-center">
              {products.map((item) => {
                return <Product key={item.id} item={item} />;
              })}
            </div>
          </div>
          {hasMore && (
            <div ref={observerTarget}>
              <SpinnerLoading />
            </div>
          )}
          {!hasMore && products.length > 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No more products to load</p>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Productspage;
