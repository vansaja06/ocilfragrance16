// Mengimpor mongoose untuk membuat schema dan model
import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

// Schema untuk data Penawaran Terbatas (Limited Offer) yang ditampilkan di halaman website
const LimitedOfferSchema = new Schema(
  {
    // Produk yang ditawarkan dalam penawaran terbatas
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },

    // Label judul penawaran (contoh: "Limited Offer")
    label: {
      type: String,
      default: "Limited Offer",
    },

    // Teks persentase diskon (contoh: "30%")
    discountText: {
      type: String,
      default: "30%",
    },

    // Deskripsi penawaran
    description: {
      type: String,
      default: "Discount For Selected Perfumes",
    },

    // Teks tombol CTA (contoh: "Shop Now")
    buttonText: {
      type: String,
      default: "Shop Now",
    },

    // Status aktif/tidaknya penawaran ini
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
export default models.LimitedOffer || model("LimitedOffer", LimitedOfferSchema);
