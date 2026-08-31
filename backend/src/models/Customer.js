// Mengimpor mongoose untuk membuat schema dan model
import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

// Schema untuk data Pelanggan (customer yang melakukan pemesanan)
const CustomerSchema = new Schema(
  {
    // Nama pelanggan
    name: {
      type: String,
      required: true,
    },

    // Email pelanggan (opsional)
    email: {
      type: String,
      default: "",
    },

    // Nomor telepon pelanggan (opsional)
    phone: {
      type: String,
      default: "",
    },

    // Alamat pelanggan (opsional)
    address: {
      type: String,
      default: "",
    },

    // Kota pelanggan (opsional)
    city: {
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
export default models.Customer || model("Customer", CustomerSchema);
