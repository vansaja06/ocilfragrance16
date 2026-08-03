import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { connectDB } from "@/lib/mongodb";
import { comparePassword } from "@/lib/bcrypt";
import { signToken } from "@/lib/jwt";
import Admin from "@/models/Admin";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return NextResponse.json(
        { message: "Email tidak ditemukan" },
        { status: 401 }
      );
    }

    const valid = await comparePassword(password, admin.password);

    if (!valid) {
      return NextResponse.json(
        { message: "Password salah" },
        { status: 401 }
      );
    }

    const token = signToken({
      id: admin._id,
      email: admin.email,
    });

    const cookieStore = await cookies();

    cookieStore.set("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      success: true,
      admin: {
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}