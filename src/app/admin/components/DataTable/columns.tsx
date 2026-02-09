"use client";

import { fromUrlFormat } from "@/app/lib/urlFormatter";
import { ProductType } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Column, ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { useRef, useState } from "react";
import { GrEdit } from "react-icons/gr";
import { RiDeleteBinLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  CheckCheck,
  Ellipsis,
  ImageIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from "axios";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const DescriptionCell = ({ product }: { product: ProductType }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <>
      <p className={isExpanded ? "line-clamp-none" : "line-clamp-1"}>
        {product.description}
      </p>
      <button
        className="text-black whitespace-nowrap hover:text-blue-700 text-xs font-bold"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? "show less" : "show more"}
      </button>
    </>
  );
};
export function deleteProduct(productId: number) {
  try {
    const response = axios.delete(`${API_KEY}/products/${productId}`);
    console.log("Response:", response);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}
const ProductControls = ({
  product,
  onDelete,
  onUpdate,
  categories,
}: {
  product: ProductType;
  onDelete: (id: number) => void;
  onUpdate: (product: ProductType) => void;
  categories: string[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteProduct(product.id);
      setIsOpen(false);
      onDelete(product.id);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete product");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <button
                className="w-full h-10  flex items-center gap-1"
                onClick={() => {
                  setIsEditOpen(true);
                }}
              >
                <GrEdit />
                <span>Edit</span>
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                className="w-full h-10 flex items-center gap-1 "
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                <RiDeleteBinLine />
                <span>Delete</span>
              </button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg">
              Delete Product?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <div>
                <p className="font-semibold text-gray-900">{product.title}</p>
                <p className="text-sm text-gray-600">Price: ${product.price}</p>
              </div>
              <p className="text-red-600 font-medium">
                ⚠️ This action cannot be undone. This will permanently delete
                the product from the database.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
      <EditProductModal
        product={product}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={onUpdate}
        categories={categories}
      />
    </div>
  );
};

const SortingButton = ({
  column,
  header,
}: {
  column: Column<ProductType, unknown>;
  header: string;
}) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {header}
      {column.getIsSorted() === "asc" ? (
        <ArrowDown className="" />
      ) : column.getIsSorted() === "desc" ? (
        <ArrowUp className=" " />
      ) : (
        <ArrowDown />
      )}
    </Button>
  );
};

const EditProductModal = ({
  product,
  isOpen,
  onClose,
  onSave,
  categories,
}: {
  product: ProductType;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProduct: ProductType) => void;
  categories: string[];
}) => {
  const [formData, setFormData] = useState<ProductType>(product);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState(product.image);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
    if (name === "image" && e.target instanceof HTMLInputElement) {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageData = reader.result as string;
          setImagePreview(imageData);
          setFormData((prev) => ({
            ...prev,
            image: imageData,
          }));
        };
        reader.readAsDataURL(file);
      }
      return;
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await axios.put(
        `${API_KEY}/products/${product.id}`,
        formData,
      );
      const updatedProduct = await response.data;
      onSave(updatedProduct);
      onClose();
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 space-y-4 ">
        <div className="flex justify-center">
          {imagePreview && (
            <div className="">
              <Image
                src={imagePreview}
                alt="preview"
                className="object-contain"
                width={100}
                height={100}
                loading="lazy"
              />
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium ">Product Name</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="px-2 border rounded-sm  mt-2.5 py-2.5  w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium ">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="px-2 border rounded-sm  mt-2.5 py-2.5  w-full"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium ">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="px-2 border rounded-sm  mt-2.5 py-2.5  w-full"
            />
          </div>

          <div className="">
            <label className="block text-sm font-medium ">Image</label>
            <div className=" px-2 border rounded-sm  mt-2.5 py-2  hover:bg-black hover:text-white transition-colors">
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
                ref={fileInputRef}
                name="image"
                id="productImage"
                accept="image/*"
                onChange={handleChange}
                className=" w-full"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium ">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="px-2 border rounded-sm  mt-2.5 py-2.5 h-24  w-full"
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2  rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 flex items-center bg-black text-white rounded hover:bg-gray-900"
          >
            <Check className="mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export const columns = (
  onDelete: (id: number) => void,
  onUpdate: (product: ProductType) => void,
  categories: string[],
): ColumnDef<ProductType>[] => [
  {
    accessorKey: "id",
    size: 50,
    header: ({ column }) => {
      return <SortingButton column={column} header="Id" />;
    },
    cell: ({ row }) => (
      <div className="font-bold text-black">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <div className="relative w-12 h-12">
        <Image
          src={row.getValue("image")}
          alt={row.original.title}
          fill
          className="object-contain "
          sizes="100px"
          loading="lazy"
        />
      </div>
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return <SortingButton column={column} header="Product" />;
    },
    cell: ({ row }) => (
      <Tooltip>
        <TooltipTrigger className="line-clamp-1 font-bold">
          {row.getValue("title")}
        </TooltipTrigger>
        <TooltipContent>
          <p>{row.getValue("title")}</p>
        </TooltipContent>
      </Tooltip>
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return <SortingButton column={column} header="Category" />;
    },
    cell: ({ row }) => {
      const categoryStyles: Record<string, string> = {
        electronics: "bg-teal-100 text-teal-800",
        "men's clothing": "bg-yellow-100 text-yellow-800",
        "women's clothing": "bg-pink-100 text-pink-800",
        jewellery: "bg-gray-100 text-gray-800",
      };
      const category = row.getValue("category") as string;
      return (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
            categoryStyles[category] || "bg-gray-100 text-gray-800"
          }`}
        >
          {category}
        </span>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return <SortingButton column={column} header="Price" />;
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);

      return (
        <div className="text-sm font-bold text-emerald-800 whitespace-nowrap">
          <span className="">{formatted}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <DescriptionCell product={row.original} />,
  },

  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      return (
        <>
          <ProductControls
            product={row.original}
            onDelete={onDelete}
            onUpdate={onUpdate}
            categories={categories}
          />
        </>
      );
    },
  },
];
