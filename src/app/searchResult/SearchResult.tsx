"use client";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import useProducts from "../hooks/useProducts";
import { ProductType } from "@/utils/lib/types";
import Product from "../products/Product";

const SearchResult = () => {
  const { products } = useProducts();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const router = useRouter();
  const [result, setResult] = useState<ProductType[]>([]);
  useEffect(() => {
    if (query) {
      const filtered = products.filter((product) =>
        product.title.toLowerCase().includes(query.toLowerCase()),
      );
      setResult(filtered);
    }
  }, [query, products]);
  return (
    <>
      <div className="flex  justify-center  w-full">
        <div className="grid  lg:grid-cols-4 md:grid-cols-2 grid-cols-1 mb-2  gap-4  justify-center">
          {result.map((product) => (
            <>
              <Product key={product.id} item={product} />
            </>
          ))}
        </div>
      </div>

      {/* No Results */}
      {result.length === 0 && (
        <>
          <div className=" w-11/12 mx-auto mt-4 ">
            <p className="text-black ">
              No products found for{" "}
              <span className="font-bold"> &quot;{query}&quot; </span> try these
              products instead:
            </p>
          </div>
          <div className="flex  justify-center  w-full">
            <div className="grid  lg:grid-cols-4 md:grid-cols-2 grid-cols-1 mb-2  gap-4  justify-center">
              {products.map((product) => (
                <>
                  <Product key={product.id} item={product} />
                </>
              ))}
            </div>
          </div>
          {/* <button onClick={() => router.push("/")}>Back to Home</button> */}
        </>
      )}
    </>
  );
};

export default SearchResult;
