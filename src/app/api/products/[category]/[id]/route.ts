import { Product } from "../../../../../../prisma/@/generated/prisma/client/browser";
import { join } from "path";
import { prisma } from "@/utils/lib/prisma";
import { mkdir, unlink, writeFile } from "fs/promises";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fromUrlFormat } from "@/utils/lib/urlFormatter";

interface RouteParams {
  params: {
    id: string;
    category: string;
  };
}
const updatedProductSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  price: z.coerce.number().positive(),
  category: z.string(),
});

export const GET = async (request: NextRequest, { params }: RouteParams) => {
  // const product = products.find((product) => product.id === Number(params.id));
  const product = await prisma.product.findUnique({
    where: {
      id: parseInt(params.id),
      category: fromUrlFormat(params.category),
    },
  });
  return !product
    ? NextResponse.json({ message: "Product not found" }, { status: 404 })
    : NextResponse.json(product, {
        status: 200,
      });
};

export const PUT = async (req: NextRequest, { params }: RouteParams) => {
  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const category = formData.get("category") as string;
    const imageFile = formData.get("image") as File;

    const validation = updatedProductSchema.safeParse({
      title,
      description,
      price,
      category,
    });

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid product data", errors: validation.error.format() },
        { status: 400 },
      );
    }
    // Build update data
    const updateData: any = {
      title: validation.data.title,
      description: validation.data.description,
      price: validation.data.price,
      category: validation.data.category,
    };

    // ✅ Handle image replacement
    if (
      imageFile &&
      imageFile instanceof File &&
      (imageFile as File).size > 0
    ) {
      try {
        // Get old product to find old image
        const oldProduct = await prisma.product.findUnique({
          where: { id: parseInt(params.id) },
        });

        // ✅ Delete old image file if it exists
        if (oldProduct?.image) {
          const oldImagePath = join(process.cwd(), "public", oldProduct.image);
          try {
            await unlink(oldImagePath);
            console.log("Old image deleted:", oldProduct.image);
          } catch (deleteError) {
            console.warn("Could not delete old image:", deleteError);
            // Continue even if delete fails
          }
        }

        // Save new image
        const blob = imageFile as Blob;
        const buffer = Buffer.from(await blob.arrayBuffer());

        const uploadDir = join(process.cwd(), "public/uploads");
        await mkdir(uploadDir, { recursive: true });

        const filename = (imageFile as File).name;
        const ext = filename.split(".").pop() || "jpg";
        const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
        const filepath = join(uploadDir, uniqueFilename);

        await writeFile(filepath, buffer);
        updateData.image = `/uploads/${uniqueFilename}`;

        console.log("New image saved:", updateData.image);
      } catch (fileError: any) {
        console.error("File operation error:", fileError.message);
        return NextResponse.json(
          { message: "Error processing image", details: fileError.message },
          { status: 400 },
        );
      }
    } else {
      console.log("No new image, keeping existing");
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: {
        id: parseInt(params.id),
      },
      data: updateData,
    });

    console.log("Product updated:", updatedProduct);
    return NextResponse.json(updatedProduct, { status: 200 }); // ✅ Use 200, not 201
  } catch (error: any) {
    console.error("Error:", error.message);
    return NextResponse.json(
      { message: "Error updating product", details: error.message },
      { status: 500 },
    );
  }
};
export const DELETE = async (request: NextRequest, { params }: RouteParams) => {
  const product = await prisma.product.delete({
    where: {
      id: parseInt(params.id),
    },
  });

  return !product
    ? NextResponse.json({ message: "Product not found" }, { status: 404 })
    : NextResponse.json(
        { message: "Product deleted successfully" },
        { status: 200 },
      );
};
