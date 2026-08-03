import { NextResponse } from "next/server";

import { v2 as cloudinary } from "cloudinary";

const configured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const image = body?.image;

    if (!image) {
      return NextResponse.json(
        { success: false, message: "Gambar wajib diisi" },
        { status: 400 }
      );
    }

    if (!configured) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cloudinary belum dikonfigurasi. Isi CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, dan CLOUDINARY_API_SECRET di .env.local lalu restart.",
        },
        { status: 500 }
      );
    }

    const result = await cloudinary.uploader.upload(image, {
      folder: "ocilfragrance16",
    });

    return NextResponse.json({ success: true, url: result.secure_url });
  } catch (error) {
    const raw = error as { message?: string } | null;

    const message =
      raw?.message || "Periksa konfigurasi Cloudinary";

    return NextResponse.json(
      { success: false, message: `Gagal mengunggah gambar: ${message}` },
      { status: 500 }
    );
  }
}
