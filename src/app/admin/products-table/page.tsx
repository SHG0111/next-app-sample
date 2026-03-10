"use client";
import React from "react";
import { useEffect, useState } from "react";
import { ProductType } from "@/utils/lib/types";
import DataTable from "../components/DataTable/page";
import { columns } from "../components/DataTable/columns";
import ProductForm from "../components/ProductForm/page";
import useProducts from "@/app/hooks/useProducts";
export default function ProductsTablePage() {
  const [formExpanded, setFormExpanded] = useState(false);
  const { products, getProducts, categories, setProducts } = useProducts();

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <button
          className="box-bg "
          onClick={() => {
            setFormExpanded(!formExpanded);
          }}
        >
          New Product
        </button>
      </div>
      {formExpanded && (
        <div className="mt-4 mb-10 py-5 ">
          <ProductForm />
        </div>
      )}
      {/* {loading ? (
        <Loading />
      ) : ( */}
      <DataTable
        columns={columns(
          (id) => setProducts((prev) => prev.filter((p) => p.id !== id)),

          (updatedProduct) =>
            setProducts((prev) =>
              prev.map((p) =>
                p.id === updatedProduct.id ? updatedProduct : p,
              ),
            ),
          categories,
        )}
        data={products}
      />
      {/* )} */}
    </div>
  );
}
