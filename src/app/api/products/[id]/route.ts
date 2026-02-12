import products from "@/data/products";
import { DUpdatedProductType } from "@/utils/lib/types/dto";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: {
    id: string;
  };
}
export const GET = async (request: NextRequest, { params }: RouteParams) => {
  const product = products.find((product) => product.id === Number(params.id));
  return !product
    ? NextResponse.json({ message: "Product not found" }, { status: 404 })
    : NextResponse.json(product, { status: 200 });
};
export const PUT = async (request: NextRequest, { params }: RouteParams) => {
  const product = products.find((product) => product.id === Number(params.id));
  const data: DUpdatedProductType = await request.json();

  return !product
    ? NextResponse.json({ message: "Product not found" }, { status: 404 })
    : NextResponse.json(
        { message: "Product updated successfully" },
        { status: 200 },
      );
};

export const DELETE = async (request: NextRequest, { params }: RouteParams) => {
  const product = products.filter(
    (product) => product.id === Number(params.id),
  );

  return !product
    ? NextResponse.json({ message: "Product not found" }, { status: 404 })
    : NextResponse.json(
        { message: "Product deleted successfully" },
        { status: 200 },
      );
};
