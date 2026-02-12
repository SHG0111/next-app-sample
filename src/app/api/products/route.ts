import { ProductType } from "@/types";
import { DCreatedProductType } from "@/types/dto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import products from "@/data/products";

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

    // 4. Construct the final object
    const createdProduct: ProductType = {
      ...validation.data, // Use the validated data
      id: Math.floor(Math.random() * 1000), // Generate ID server-side
    };

    // 5. POST to External API
    // const apiResponse = await axios.post(`${API_URL}/products`, createdProduct);

    return NextResponse.json(createdProduct, { status: 201 });
  } catch (error: any) {
    console.error(
      "❌ POST HANDLER CRASHED:",
      error.response?.data || error.message,
    );

    return NextResponse.json(
      { message: "Internal Server Error", details: error.message },
      { status: 500 },
    );
  }
};
