"use client";
import type { ProductType } from "@/types";
import styles from "@/app/products/card.module.css";
import Image from "next/image";
import Link from "next/link";
import { fromUrlFormat, toUrlFormat } from "../lib/urlFormatter";
import { Badge } from "@/components/ui/badge";
import { CircleDollarSign, DollarSign } from "lucide-react";
import { useImageColor } from "@/lib/utils";
const Product = ({ item }: { item: ProductType }) => {
  const backgroundColor = useImageColor(item.image);

  return (
    <>
      <div className={`${styles.card} col-span-1 `}>
        <Link href={`/products/${toUrlFormat(item.category)}/${item.id}`}>
          <div
            className={`${styles.imageContainer} `}
            style={{ backgroundColor }}
          >
            <Image
              src={`${item.image}`}
              alt={item.title}
              loading="lazy"
              width="80"
              height="80"
              priority={false}
              quality={10}
              className={`${styles.image}  object-contain place-self-center`}
            />
          </div>
          <div className={`${styles.title} line-clamp-2 mt-2 `}>
            {item.title}
          </div>
        </Link>
        {/* <Link
          className={`${styles.category}  `}
          href={`/products/${toUrlFormat(item.category)}`}
        >
          <span
            className={`${
              item.category === "electronics"
                ? "border-teal-500 text-teal-500 hover:bg-teal-200   hover:text-black transition-all"
                : fromUrlFormat(item.category) === "men's clothing"
                  ? "border-yellow-600 text-yellow-700 hover:bg-yellow-100   hover:text-black transition-all"
                  : item.category === "women's clothing"
                    ? "border-pink-500 text-pink-500 hover:bg-pink-300   hover:text-black transition-all"
                    : item.category === "jewerlery"
                      ? "border-gray-200 text-gray-200 hover:bg-gray-200   hover:text-black transition-all"
                      : "border-black-500 text-black-500 hover:bg-slate-100   hover:text-black transition-all"
            } inline-flex items-center  px-2 py-1 font-semibold   text-gray-400 border border-gray-300  rounded-full inset-ring inset-ring-gray-500/10`}
          >
            {item.category}
          </span>
        </Link> */}
        {/* <div className={`${styles.description} line-clamp-2`}>
          {item.description}
        </div> */}
        <Badge
          variant={"outline"}
          className="rounded-0 border-none px-0 text-sm mt-2 text-green-500 border-green-500 py-0"
        >
          {item.price} <span className="ml-1">$</span>
        </Badge>
      </div>
    </>
  );
};

export default Product;
