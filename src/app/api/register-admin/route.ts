import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { hashPassword } from "@/lib/bcrypt";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const { name, email, password } = body;

    const exist = await Admin.findOne({
      email,
    });

    if (exist) {
      return NextResponse.json(
        {
          message: "Admin already exists",
        },
        {
          status: 400,
        }
      );
    }

    const hashed = await hashPassword(password);

    await Admin.create({
      name,
      email,
      password: hashed,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.log(err);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}