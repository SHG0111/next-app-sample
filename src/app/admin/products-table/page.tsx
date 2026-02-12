"use client";
import React from "react";
import { useEffect, useState } from "react";

import { AiOutlineProduct } from "react-icons/ai";

import { ProductType } from "@/utils/lib/types";
import DataTable from "../components/DataTable/page";
import { columns } from "../components/DataTable/columns";
import ProductForm from "../components/ProductForm/page";
import axios from "axios";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export default function ProductsTablePage() {
  const [formExpanded, setFormExpanded] = useState(false);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [category, setCategory] = useState<string[]>([]);

  async function getData(): Promise<ProductType[]> {
    try {
      const res = await axios.get(`${API_KEY}/products`);
      const response = await res.data;
      setProducts(response);
      const uniqueCategories = Array.from(
        new Set(response.map((p: ProductType) => p.category)),
      ) as string[];
      setCategory(uniqueCategories);
      return response;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }
  useEffect(() => {
    getData();
  }, []);

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
          <ProductForm
            setProducts={setProducts}
            products={products}
            category={category}
          />
        </div>
      )}

      <DataTable
        columns={columns(
          (id) => setProducts((prev) => prev.filter((p) => p.id !== id)),

          (updatedProduct) =>
            setProducts((prev) =>
              prev.map((p) =>
                p.id === updatedProduct.id ? updatedProduct : p,
              ),
            ),
          category,
        )}
        data={products}
      />
    </div>
  );
}
