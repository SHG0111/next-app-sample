import type { ProductType } from "@/types";
import styles from "@/app/products/card.module.css";
import Image from "next/image";
import Link from "next/link";

const Product = ({ item }: { item: ProductType }) => {
  return (
    <>
      <div className={`${styles.card} col-span-1`}>
        <Image
          src={`${item.image}`}
          alt={item.title}
          width={100}
          height={100}
          loading="lazy"
          priority={false}
          className={`${styles.image}  object-contain object-center`}
        />
        <div className={`${styles.title} line-clamp-2`}>
          <Link href={`/products/${item.id}`}>{item.title}</Link>
        </div>
        <Link className={`${styles.category}  `} href={`/products/${item.id}`}>
          <span className="inline-flex items-center mb-3  px-2 py-1 text-xs font-medium text-gray-400 border border-gray-300 rounded-full inset-ring inset-ring-gray-500/10">
            {item.category}
          </span>
        </Link>
        <div className={`${styles.description} line-clamp-2`}>
          {item.description}
        </div>
        <div className={`${styles.price} `}>{item.price}</div>
      </div>
    </>
  );
};

export default Product;
