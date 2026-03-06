"use client";
import { ProductType } from "@/utils/lib/types";
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
import { useProducts } from "@/app/hooks/useProducts";
const ProductForm = () => {
  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [productCategory, setProductCategory] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productdisc, setProductdisc] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { categories, addProduct, products } = useProducts();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const handleAddForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!productImage) {
      alert("Please select an image");
      return;
    }
    console.log("Image file before send:", productImage); // ← Debug this
    const productFormData = new FormData();
    productFormData.append("title", productName);
    productFormData.append("description", productdisc);
    productFormData.append("price", productPrice.toString());
    productFormData.append("category", productCategory);
    productFormData.append("image", productImage); // ← Make sure this is a File object

    // const newProduct: ProductType = {
    //   id: products.length + 1,
    //   title: productName,
    //   description: productdisc,
    //   image: imagePreview || "",
    //   price: productPrice,
    //   category: productCategory,
    // };
    addProduct(productFormData);
    setProductName("");
    setProductCategory("");
    setProductPrice(0);
    setProductdisc("");
    setProductImage(null);
    setImagePreview(null);
  };
  return (
    <form
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 capitalize text-sm"
      method="POST"
      action={""}
      onSubmit={(e) => {
        e.preventDefault();
        handleAddForm(e);
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
          className="h-11 px-2  mt-2.5 border "
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
              className="w-[180px] h-11 px-2 py-1 rounded-none "
              id="productCategory"
            >
              <SelectValue placeholder="category" />
            </SelectTrigger>
            <SelectContent>
              <div className="flex items-center   border-2 border-black">
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
                  className="box-bg
                        "
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    setProductCategory(productCategory.trim());
                  }}
                >
                  add category
                </button>
              </div>
              <SelectGroup>
                {categories.map((category) => (
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
          value={productPrice}
          onChange={(e) => {
            setProductPrice(Number(e.target.value));
          }}
          className="h-11 px-2  mt-3 border"
        />
      </div>
      <div className="flex flex-col self-start col-span-1">
        <label> image</label>
        <div className=" px-2 border   mt-3 py-2.5  hover:bg-black hover:text-white transition-colors">
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0];

              console.log("Selected file:", file); // ← Debug this
              console.log("File name:", file?.name);
              console.log("File type:", file?.type);
              console.log("File size:", file?.size);

              if (file) {
                setProductImage(file);
                const preview = URL.createObjectURL(file);
                setImagePreview(preview);
              }
            }}
            className="h-11 px-2 py-3  mt-3"
          />
        </div>
      </div>
      <div className="flex flex-col self-start col-span-2">
        <label htmlFor="productdisc">discription</label>
        <textarea
          placeholder="Enter product discription"
          required
          minLength={10}
          name="productdisc"
          id="productdisc"
          className="h-11 px-2 py-2  mt-3 border"
          value={productdisc}
          onChange={(e) => {
            setProductdisc(e.target.value);
          }}
        />
      </div>
      <div className="flex flex-col items-start justify-end ">
        <button type="submit" className="box-bg ">
          Add Product
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
