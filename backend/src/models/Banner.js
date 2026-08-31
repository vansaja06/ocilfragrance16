// Mengimpor mongoose untuk membuat schema dan model
import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

// Schema untuk data Banner (banner promosi yang ditampilkan di halaman website)
const BannerSchema = new Schema(
  {
    // Produk yang ditampilkan pada banner (referensi ke model Product)
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // Subtitle/banner kecil di atas judul
    subtitle: {
      type: String,
      default: "",
    },

    // Judul utama banner
    title: {
      type: String,
      required: true,
    },

    // Deskripsi/detail banner
    description: {
      type: String,
      default: "",
    },

    // Teks tombol CTA (Call to Action) pada banner
    button: {
      type: String,
      default: "",
    },

    // URL gambar banner
    image: {
      type: String,
      default: "",
    },

    // Status aktif/tidaknya banner
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
export default models.Banner || model("Banner", BannerSchema);
