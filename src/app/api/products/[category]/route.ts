import { prisma } from "@/utils/lib/prisma";
import { fromUrlFormat } from "@/utils/lib/urlFormatter";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: {
    category: string;
  };
}

export const GET = async (request: NextRequest, { params }: RouteParams) => {
  try {
    const decodedCategory = decodeURIComponent(fromUrlFormat(params.category));

    const products = await prisma.product.findMany({
      where: {
        category: {
          equals: decodedCategory,
          // mode: "insensitive", // ← Case-insensitive search
        },
      },
    });

    if (products.length === 0) {
      return NextResponse.json(
        { message: `No products found for category: ${decodedCategory}` },
        { status: 404 },
      );
    }

    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching products", error: error.message },
      { status: 500 },
    );
  }
};
