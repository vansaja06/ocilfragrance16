// Mengimpor mongoose untuk membuat schema dan model
import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

// Schema untuk data Admin (akun administrator yang bisa login ke panel admin)
const AdminSchema = new Schema(
  {
    // Nama admin
    name: {
      type: String,
      required: true,
    },

    // Email admin (unique agar tidak ada email yang sama)
    email: {
      type: String,
      required: true,
      unique: true,
    },

    // Password admin (akan di-hash sebelum disimpan)
    password: {
      type: String,
      required: true,
    },
  },
  {
    // Otomatis menambahkan field createdAt dan updatedAt
    timestamps: true,
  }
);

// Mengekspor model, menggunakan model yang sudah ada jika sudah terdaftar (hot-reload safe)
export default models.Admin || model("Admin", AdminSchema);
