// Mengimpor mongoose untuk membuat schema dan model
import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

// Schema untuk data Pengaturan toko (key-value store untuk pengaturan umum)
const SettingSchema = new Schema(
  {
    // Kunci pengaturan (contoh: "general" untuk pengaturan umum)
    key: {
      type: String,
      required: true,
      unique: true,
    },

    // Nilai pengaturan (bisa berupa object atau tipe data apapun karena menggunakan Mixed)
    value: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    // Otomatis menambahkan field createdAt dan updatedAt
    timestamps: true,
  }
);

// Mengekspor model, menggunakan model yang sudah ada jika sudah terdaftar
export default models.Setting || model("Setting", SettingSchema);
