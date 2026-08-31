// Mengimpor mongoose untuk membuat schema dan model
import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

// Schema untuk data Produk (parfum yang dijual)
const ProductSchema = new Schema(
  {
    // Nama produk
    name: {
      type: String,
      required: true,
    },

    // Slug produk untuk URL yang SEO-friendly (contoh: "aventus-100ml"), sparse agar bisa kosong
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },

    // Referensi ke kategori produk
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },

    // Deskripsi singkat produk
    description: {
      type: String,
      default: "",
    },

    // Deskripsi lengkap/rinci produk
    longDescription: {
      type: String,
      default: "",
    },

    // Harga produk
    price: {
      type: Number,
      required: true,
      default: 0,
    },

    // URL gambar utama produk
    image: {
      type: String,
      default: "",
    },

    // Jumlah stok yang tersedia
    stock: {
      type: Number,
      default: 0,
    },

    // Rating produk (0-5)
    rating: {
      type: Number,
      default: 0,
    },

    // Jumlah produk yang sudah terjual
    sold: {
      type: Number,
      default: 0,
    },

    // Apakah produk ini ditampilkan sebagai produk unggulan
    featured: {
      type: Boolean,
      default: false,
    },

    // Apakah produk ini tersedia dalam ukuran decant (botol kecil/sample)
    hasDecant: {
      type: Boolean,
      default: false,
    },

    // Daftar opsi decant (ukuran dan harga masing-masing)
    decants: {
      type: [
        {
          // Ukuran decant (contoh: "5ml", "10ml")
          size: {
            type: String,
            required: true,
          },

          // Harga decant berdasarkan ukuran
          price: {
            type: Number,
            required: true,
            default: 0,
          },
        },
      ],
      default: [],
    },

    // Daftar opsi ukuran yang tersedia (contoh: ["50ml", "100ml"])
    sizes: {
      type: [String],
      default: [],
    },
  },
  {
    // Otomatis menambahkan field createdAt dan updatedAt
    timestamps: true,
  }
);

// Mengekspor model, menggunakan model yang sudah ada jika sudah terdaftar
export default models.Product || model("Product", ProductSchema);
