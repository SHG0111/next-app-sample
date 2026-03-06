import { prisma } from "@/utils/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
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
    const authToken = req.headers.get("authToken");
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
