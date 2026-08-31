// Mengimpor mongoose untuk membuat schema dan model
import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

// Schema untuk data Koleksi (tampilan produk unggulan di halaman depan dalam format grid)
const CollectionSchema = new Schema(
  {
    // Produk di posisi kiri (referensi ke model Product)
    leftProduct: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },

    // Produk di posisi kanan atas (referensi ke model Product)
    topRightProduct: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },

    // Produk di posisi kiri bawah (referensi ke model Product)
    bottomLeftProduct: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },

    // Status aktif/tidaknya koleksi ini
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    // Otomatis menambahkan field createdAt dan updatedAt
    timestamps: true,
  }
);

// Mengekspor model, menggunakan model yang sudah ada jika sudah terdaftar
export default models.Collection || model("Collection", CollectionSchema);
