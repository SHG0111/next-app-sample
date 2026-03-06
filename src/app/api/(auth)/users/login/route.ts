import { prisma } from "@/utils/lib/prisma";
import { Param } from "@prisma/client/runtime/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { is } from "zod/v4/locales";
import { generateJWTToken } from "@/utils/lib/jwt";
export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.json();

    const { email, password } = formData;
    if (!email || !password) {
      return NextResponse.json(
        { message: "email and password are required" },
        { status: 400 },
      );
    }
    const createUserSchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });
    const validation = createUserSchema.safeParse({
      email,
      password,
    });
    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid user data", errors: validation.error.format() },
        { status: 400 },
      );
    }
    const existingUser = await prisma.user.findUnique({
      where: { email: validation.data.email },
    });
    if (!existingUser) {
      return NextResponse.json(
        { message: "User with this email does not exist" },
        { status: 400 },
      );
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 400 },
      );
    }
    // Generate a token (for simplicity, using user ID here, but consider using JWT for production)
    // const token = `token-${existingUser.id}`;
    const userpayload = {
      id: existingUser.id,
      isAdmin: existingUser.isAdmin,
      email: existingUser.email,
    };
    const token = generateJWTToken(userpayload);
    return NextResponse.json(
      {
        message: "User logged in successfully",
        ...existingUser,
        token,
        user: userpayload,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      {
        message: "Something went wrong during login",
        debug_info: error.message,
      },
      { status: 500 },
    );
  }
};
