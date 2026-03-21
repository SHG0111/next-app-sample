import { prisma } from "@/utils/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { z } from "zod";
import bcrypt from "bcryptjs";

const updatedUserSchema = z.object({
  username: z.string().min(4),
  email: z.string().email(),
  password: z.string().optional(),
  phone: z.string().optional(),
});
const getTokenFromHeader = (req: NextRequest): string | null => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return null;

  return parts[1];
};
export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
  try {
    const body = await req.json();
    const { username, email, password, phone } = body;
    const validation = updatedUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid user data", errors: validation.error.format() },
        { status: 400 },
      );
    }

    const userId = parseInt(params.id);
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    if (validation.data.password && validation.data.password.trim()) {
      const hashedPassword = await bcrypt.hash(validation.data.password, 10);
      validation.data.password = hashedPassword;
    } else {
      delete validation.data.password;
    }
    const authToken = getTokenFromHeader(req);
    if (!authToken) {
      return NextResponse.json(
        { message: "Authorization token is required" },
        { status: 401 },
      );
    }
    const decodedToken = jwt.verify(
      authToken,
      process.env.JWT_SECRET!,
    ) as jwt.JwtPayload;
    if (typeof decodedToken === "object" && decodedToken.id !== userId) {
      return NextResponse.json(
        { message: "Unauthorized to update this user" },
        { status: 403 },
      );
    } else if (decodedToken.id === userId) {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          username: validation.data.username,
          email: validation.data.email,
          password: validation.data.password,
          phone: validation.data.phone,
        },
        select: {
          id: true,
          username: true,
          email: true,
          phone: true,
        },
      });
      return NextResponse.json(
        {
          message: "User updated successfully",
          user: updatedUser,
        },
        {
          status: 200,
        },
      );
    }
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      {
        message: "Something went wrong during update",
        debug_info: error.message,
      },
      { status: 500 },
    );
  }
};
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
  try {
    const userId = parseInt(params.id, 10);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const authToken = getTokenFromHeader(req);
    if (!authToken) {
      return NextResponse.json(
        { message: "Authorization token is required" },
        { status: 401 },
      );
    }
    const decodedToken = jwt.verify(
      authToken,
      process.env.JWT_SECRET!,
    ) as jwt.JwtPayload;
    if (decodedToken.id !== userId) {
      return NextResponse.json(
        { message: "Unauthorized to delete this user" },
        { status: 403 },
      );
    } else if (decodedToken.id === userId) {
      await prisma.user.delete({
        where: { id: userId },
      });
    }

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
