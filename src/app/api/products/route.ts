import { ProductType } from "@/utils/lib/types";
import { DCreatedProductType } from "@/utils/lib/types/dto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import products from "@/data/products";
import { prisma } from "@/utils/lib/prisma";
import { Product } from "@/app/generated/prisma/client/client";

const createProductSchema = z.object({
  title: z.string().min(2),
  description: z.string(),
  price: z.number().positive(),
  category: z.string(),
  image: z.string().url(),
});

export const GET = async () => {
  try {
    const response = products;

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error(error.message);

    return NextResponse.json(
      {
        message: "Something went wrong getting products",
        debug_info: error.message, // Sending this to the browser temporarily to help you see the error
      },
      { status: 500 },
    );
  }
};
export const POST = async (req: NextRequest) => {
  try {
    const products: DCreatedProductType = await req.json();
    const validation = createProductSchema.safeParse(products);
    if (!validation.success) {
      console.error("❌ ZOD VALIDATION FAILED:", validation.error.format());
      return NextResponse.json(
        { message: "Invalid product data", errors: validation.error.format() },
        { status: 400 },
      );
    }

    const createdProduct: Product = await prisma.product.create({
      data: {
        ...validation.data,
      },
    });

    return NextResponse.json(createdProduct, { status: 201 });
  } catch (error: any) {
    console.error("❌ FULL ERROR OBJECT:");
    console.error(error);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Client version:", error.clientVersion);

    // Log the actual validation error details
    if (error.meta?.cause) {
      console.error("Cause:", error.meta.cause);
    }

    return NextResponse.json(
      {
        message: "Internal Server Error",
        details: error.message,
        code: error.code,
        cause: error.meta?.cause,
      },
      { status: 500 },
    );
  }
};
