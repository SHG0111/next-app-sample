// /app/api/export/products/route.ts
import { prisma } from "@/utils/lib/prisma";
import { ProductType } from "@/utils/lib/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    // Fetch products
    const products = await prisma.product.findMany();

    if (products.length === 0) {
      return NextResponse.json(
        { message: "No products found" },
        { status: 404 },
      );
    }

    // Convert to CSV
    const headers = Object.keys(products[0]);
    const csvHeaders = headers.join(",");

    const csvRows = products.map((product: ProductType) => {
      return headers
        .map((header) => {
          const value = product[header as keyof ProductType];
          if (typeof value === "string" && value.includes(",")) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(",");
    });

    const csv = [csvHeaders, ...csvRows].join("\n");
    console.log(csv);
    // Return as downloadable file
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=products.csv",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error exporting products", details: error.message },
      { status: 500 },
    );
  }
};
