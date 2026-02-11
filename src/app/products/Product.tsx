"use client";
import type { ProductType } from "@/types";
import styles from "@/app/products/card.module.css";
import Image from "next/image";
import Link from "next/link";
import { fromUrlFormat, toUrlFormat } from "../lib/urlFormatter";
import { Badge } from "@/components/ui/badge";
import { CircleDollarSign, DollarSign } from "lucide-react";
import { useImageColor } from "@/lib/utils";
import { Tooltip, TooltipTrigger } from "@radix-ui/react-tooltip";
import { TooltipContent } from "@/components/ui/tooltip";
const Product = ({ item }: { item: ProductType }) => {
  const backgroundColor = useImageColor(item.image);
  const categoryStyles: Record<string, string> = {
    electronics: "bg-teal-100 text-teal-800",
    "men's clothing": "bg-yellow-100 text-yellow-800",
    "women's clothing": "bg-pink-100 text-pink-800",
    jewellery: "bg-gray-100 text-gray-800",
  };
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
          <Tooltip>
            <TooltipTrigger>
              <div className={`${styles.title} line-clamp-1 mt-2 `}>
                {item.title}
              </div>
            </TooltipTrigger>
            <TooltipContent>{item.title}</TooltipContent>
          </Tooltip>
        </Link>

        {/* <div className={`${styles.description} line-clamp-2`}>
          {item.description}
        </div> */}
        <div className="flex items-center justify-between  mt-2">
          <Badge
            variant={"outline"}
            className="rounded-0 border-none px-0 text-sm text-green-500 border-green-500 py-0"
          >
            {item.price} <span className="ml-1">$</span>
          </Badge>
          <Link
            className={`${styles.category}  `}
            href={`/products/${toUrlFormat(item.category)}`}
          >
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                categoryStyles[fromUrlFormat(item.category)] ||
                "bg-gray-100 text-gray-800"
              }`}
            >
              {fromUrlFormat(item.category)}
            </span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Product;
