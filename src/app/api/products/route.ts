import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/utils/lib/prisma";
import { join } from "path";

import { mkdir, writeFile } from "fs/promises";

const createProductSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  price: z.coerce.number().positive(),
  category: z.string(),
});
import products from "@/data/products";

export const GET = async () => {
  try {
    const response = await prisma.product.findMany();

    return NextResponse.json(
      response,

      {
        status: 200,
      },
    );
  } catch (error: any) {
    console.error(error.message);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong getting products",
        debug_info: error.message,
      },
      { status: 500 },
    );
  }
};
// export const POST = async () => {
//   try {
//     const response = await prisma.product.createMany({
//       data: products,
//     });
//     console.log("Products created:", response);
//     return NextResponse.json(
//       {
//         success: true,
//         message: "Products added successfully",
//         data: response,
//       },
//       { status: 200 },
//     );
//   } catch (error: any) {
//     console.error("Error adding products:", error.message);
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to add products",
//         debug_info: error.message,
//       },
//       { status: 500 },
//     );
//   }
// };
export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const category = formData.get("category") as string;
    const imageFile = formData.get("image") as File;

    console.log("Received:", {
      title,
      description,
      price,
      category,
      fileName: imageFile?.name,
    });

    // Check image first
    if (!imageFile) {
      return NextResponse.json(
        { message: "Image file is required" },
        { status: 400 },
      );
    }

    // Validate data
    const validation = createProductSchema.safeParse({
      title,
      description,
      price,
      category,
    });

    if (!validation.success) {
      console.error("❌ Validation failed:", validation.error.format());
      return NextResponse.json(
        { message: "Invalid product data", errors: validation.error.format() },
        { status: 400 },
      );
    }

    // Convert file to buffer
    const blob = imageFile as Blob;
    const buffer = Buffer.from(await blob.arrayBuffer());

    // Create uploads directory
    const uploadDir = join(process.cwd(), "public/uploads");
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const ext = imageFile.name.split(".").pop() || "jpg";
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const filepath = join(uploadDir, uniqueFilename);

    // Write file to disk
    await writeFile(filepath, buffer);

    const imageUrl = `/uploads/${uniqueFilename}`;

    console.log("File saved:", imageUrl);

    // Create product in database
    const createdProduct = await prisma.product.create({
      data: {
        title: validation.data.title,
        description: validation.data.description,
        price: validation.data.price,
        category: validation.data.category,
        image: imageUrl,
      },
    });

    console.log("Product created:", createdProduct);

    return NextResponse.json(createdProduct, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        details: error.message,
      },
      { status: 500 },
    );
  }
};
