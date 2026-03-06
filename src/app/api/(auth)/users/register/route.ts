import { prisma } from "@/utils/lib/prisma";
import { Param } from "@prisma/client/runtime/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { generateJWTToken } from "@/utils/lib/jwt";
interface RouteParams {
  params: {
    id: number;
  };
}

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.json();
    // const username = formData.get("username") as string;
    // const email = formData.get("email") as string;
    // const password = formData.get("password") as string;
    const { username, email, password } = formData;
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "Username, email and password are required" },
        { status: 400 },
      );
    }
    const createUserSchema = z.object({
      username: z.string().min(3).max(20),
      email: z.string().email(),
      password: z.string().min(6),
      // role: z.enum(["user", "admin"]).optional().default("user"),
    });
    const validation = createUserSchema.safeParse({
      username,
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
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 },
      );
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        username: validation.data.username,
        email: validation.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        isAdmin: true,
      },
    });
    const userpayload = {
      id: newUser.id,
      isAdmin: newUser.isAdmin,
      email: newUser.email,
    };
    const token = generateJWTToken(userpayload);
    return NextResponse.json(
      {
        message: "User registered successfully",
        ...newUser,
        token,
        user: userpayload,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      {
        message: "Something went wrong during registration",
        debug_info: error.message,
      },
      { status: 500 },
    );
  }
};
export const DELETE = async (params: RouteParams) => {
  try {
    const { id } = params.params;
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });
    user &&
      (await prisma.user.delete({
        where: { id: Number(id) },
      }));

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      {
        message: "Something went wrong during deletion",
        debug_info: error.message,
      },
      { status: 500 },
    );
  }
};
