"use client";

import { fromUrlFormat } from "@/app/lib/urlFormatter";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@/components/breadcrumb/breadcrumb.module.css";

const Breadcrumb = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  return (
    <nav aria-label="Breadcrumb" className={`mb-3 mt-5 ${styles.breadcrumb} `}>
      <ol className="flex list-none p-0 text-sm text-gray-600">
        <li className="flex items-center">
          {/* <Link href="/" className="hover:text-blue-600">
            Home
          </Link> */}
          {pathSegments.length > 0 && <span className="mx-2">/</span>}
        </li>
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const isLast = index === pathSegments.length - 1;

          return (
            <li key={href} className="flex items-center capitalize">
              {isLast ? (
                <span className="font-bold text-gray-900">
                  {fromUrlFormat(segment)}
                </span>
              ) : (
                <>
                  <Link href={href} className="hover:text-blue-600">
                    {fromUrlFormat(segment)}
                  </Link>
                  <span className="mx-2">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
