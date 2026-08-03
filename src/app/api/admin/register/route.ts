import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { hashPassword } from "@/lib/bcrypt";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { name, email, password } = await req.json();

    // Validasi
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Semua field wajib diisi",
        },
        { status: 400 }
      );
    }

    const exist = await Admin.findOne({ email });

    if (exist) {
      return NextResponse.json(
        {
          success: false,
          message: "Email sudah digunakan",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Register berhasil",
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}