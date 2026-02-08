"use client";
import { ProductType } from "@/types";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";
import { ImageIcon, Plus, PlusIcon } from "lucide-react";
import axios from "axios";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const ProductForm = ({
  category,
  products,
  setProducts,
}: {
  category: string[];
  products: ProductType[];
  setProducts: React.Dispatch<React.SetStateAction<ProductType[]>>;
}) => {
  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productdisc, setProductdisc] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  // const [products, setProducts] = useState<ProductType[]>([]);

  const handleAddForm = () => {
    const newProduct: ProductType = {
      id: products.length + 1,
      title: productName,
      description: productdisc,
      image: productImage,
      price: productPrice,
      category: productCategory,
    };
    try {
      const response = axios.post(`${API_KEY}/products`, newProduct);
      console.log("Success:", response);

      setProducts([newProduct, ...products]);
      //   setFormExpanded(false);
      setProductName("");
      setProductCategory("");
      setProductPrice(0);
      setProductdisc("");
      setProductImage("");
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <form
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 capitalize text-sm"
      method="POST"
      action={""}
      onSubmit={(e) => {
        e.preventDefault();
        handleAddForm();
      }}
    >
      <div className="flex flex-col self-start">
        <label htmlFor="productName">name</label>
        <input
          name="productName"
          type="text"
          placeholder="Enter product name"
          required
          autoFocus
          value={productName}
          onChange={(e) => {
            setProductName(e.target.value);
          }}
          id="productName"
          className="h-11 px-2 rounded-sm mt-2.5 border "
        />
      </div>
      {/* make this add new category and select */}
      <div className="flex flex-col self-start">
        <Field>
          <FieldLabel>category</FieldLabel>
          <Select
            onValueChange={(value) => {
              setProductCategory(value);
            }}
            open={isOpen}
            onOpenChange={setIsOpen}
          >
            <SelectTrigger
              className="w-[180px] h-11 px-2 py-1 rounded-sm"
              id="productCategory"
            >
              <SelectValue placeholder="category" />
            </SelectTrigger>
            <SelectContent>
              <div className="flex items-center rounded-sm  border-2 border-black">
                <input
                  type="text"
                  placeholder="new category"
                  name="newCategory"
                  id="newCategory"
                  onChange={(e) => {
                    setProductCategory(e.target.value);
                  }}
                  value={productCategory}
                  className="py-2 px-2 text-xs focus:outline-none "
                />
                <button
                  className="bg-black flex items-center py-2 px-2 text-xs text-white
                        "
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    setProductCategory(productCategory.trim());
                  }}
                >
                  {" "}
                  <Plus className="mr-1" /> new category
                </button>
              </div>
              <SelectGroup>
                {category.map((category) => (
                  <SelectItem value={category} key={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </div>
      <div className="flex flex-col self-start">
        <label htmlFor="productPrice">price</label>
        <input
          type="number"
          placeholder="60$"
          required
          name="productPrice"
          id="productPrice"
          className="h-11 px-2 rounded-sm mt-2.5 border"
        />
      </div>
      <div className="flex flex-col self-start col-span-1">
        <label> image</label>
        <div className=" px-2 border rounded-sm  mt-2.5 py-2.5  hover:bg-black hover:text-white transition-colors">
          <label
            htmlFor="productImage"
            className="flex items-center  cursor-pointer"
          >
            <ImageIcon className="mr-1" />
            upload
          </label>
          <input
            type="file"
            hidden
            required
            accept="image/*"
            name="productImage"
            id="productImage"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setProductImage(URL.createObjectURL(e.target.files[0]));
              }
            }}
            className="h-11 px-2 py-3 rounded-sm mt-2.5"
          />
        </div>
      </div>
      <div className="flex flex-col self-start col-span-2">
        <label htmlFor="productdisc">discription</label>
        <textarea
          placeholder="Enter product discription"
          required
          name="productdisc"
          id="productdisc"
          className="h-11 px-2 py-2 rounded-sm mt-2.5 border"
          value={productdisc}
          onChange={(e) => {
            setProductdisc(e.target.value);
          }}
        />
      </div>
      <div className="flex flex-col items-start justify-end  ">
        <button
          type="submit"
          className="bg-black text-white py-2.5  justify-center flex items-center  w-full px-2 rounded hover:bg-slate-900 transition-colors"
        >
          <PlusIcon className="mr-1  " /> Add Product
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
