// Mengimpor mongoose untuk membuat schema dan model
import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

// Schema untuk data Kategori produk (contoh: Parfum Pria, Parfum Wanita, dll)
const CategorySchema = new Schema(
  {
    // Nama kategori
    name: {
      type: String,
      required: true,
      unique: true,
    },

    // Slug kategori untuk URL yang SEO-friendly (contoh: "parfum-pria")
    slug: {
      type: String,
      required: true,
      unique: true,
    },

    // Deskripsi kategori (opsional)
    description: {
      type: String,
      default: "",
    },
  },
  {
    // Otomatis menambahkan field createdAt dan updatedAt
    timestamps: true,
  }
);

// Mengekspor model, menggunakan model yang sudah ada jika sudah terdaftar
export default models.Category || model("Category", CategorySchema);
