// Mengimpor mongoose untuk membuat schema dan model
import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

// Schema untuk data Diskon (potongan harga yang bisa diterapkan ke produk)
const DiscountSchema = new Schema(
  {
    // Nama diskon (contoh: "Promo Lebaran", "Diskon Akhir Tahun")
    name: {
      type: String,
      required: true,
    },

    // Persentase diskon (1-100)
    percentage: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },

    // ID produk yang didiskon (null = diskon berlaku untuk semua produk / global)
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },

    // Status aktif/tidaknya diskon
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
export default models.Discount || model("Discount", DiscountSchema);
