"use client";
import Image from "next/image";
import useProducts from "./hooks/useProducts";
import { fromUrlFormat, toUrlFormat } from "../utils/lib/urlFormatter";
import Link from "next/link";

export default function Home() {
  const { categories } = useProducts();
  const hovered = false;
  const categoryImage = [
    "/men-fashion.avif",
    "/jewerly.jpg",
    "/electronics.jpg",
    "/wemen-fashion.jpg",
  ];

  return (
    <>
      <div className="px-4 grid grid-cols-2 md:grid-cols-4 gap-3  h-96 uppercase ">
        {categories.map((category, index) => (
          <div key={category} className="group">
            <Link
              href={`/products/${toUrlFormat(category)}`}
              className="   group "
            >
              <div className=" relative overflow-hidden   h-5/6">
                <Image
                  src={categoryImage[index]}
                  alt={category}
                  width={350}
                  height={350}
                  className="w-full  h-full relative   object-cover hover:scale-105 grayscale                 
                transition-all duration-500 ease-in-out z-10 hover:cursor-pointer hover:opacity-90   "
                />
              </div>
              <div
                className={`text-md mt-5  border-black border-2 w-fit mx-auto  box-bg-hover-effect group-hover:box-bg-hover-effect`}
              >
                {fromUrlFormat(category)}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
