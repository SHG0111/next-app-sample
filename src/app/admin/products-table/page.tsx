"use client";
import React from "react";
import { useEffect, useState } from "react";
import { ProductType } from "@/utils/lib/types";
import DataTable from "../components/DataTable/page";
import { columns } from "../components/DataTable/columns";
import ProductForm from "../components/ProductForm/page";
import useProducts from "@/app/hooks/useProducts";
import Loading from "./loading";

export default function ProductsTablePage() {
  const [formExpanded, setFormExpanded] = useState(false);
  const { products, getProducts, categories, setProducts, loading } =
    useProducts();
  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Products</h1>
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
        <div className="mb-4">
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
