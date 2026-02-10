"use client";
import Product from "@/app/products/Product";
import Error from "./error";
import useProducts from "../hooks/useProducts";
import { useEffect } from "react";
import CategorySlider from "@/components/categorySlider/page";
import Loading from "./loading";
const Productspage = () => {
  const { products, error, getProducts, loading } = useProducts();
  useEffect(() => {
    getProducts();
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
      ) : loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex  justify-center  w-full">
            <div className="grid  lg:grid-cols-4 md:grid-cols-2 grid-cols-1 mb-2  gap-4  justify-center">
              {products.map((item) => {
                return <Product key={item.id} item={item} />;
              })}
            </div>
          </div>
          <CategorySlider />
        </>
      )}
    </>
  );
};

export default Productspage;
