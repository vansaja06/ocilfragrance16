// Mengimpor mongoose untuk koneksi ke MongoDB
import mongoose from "mongoose";
import config from "./index.js";

// Menyimpan koneksi yang sudah ada agar tidak dibuat ulang (pattern caching)
let cachedConnection = null;

// Fungsi untuk menghubungkan ke database MongoDB
export async function connectDB() {
  // Jika sudah ada koneksi aktif, langsung gunakan (tidak perlu connect ulang)
  if (cachedConnection) return cachedConnection;

  // Membuat koneksi baru ke MongoDB menggunakan URI dari config
  cachedConnection = await mongoose.connect(config.mongodbUri);

  return cachedConnection;
}

// Fungsi untuk memutuskan koneksi dari database MongoDB
export async function disconnectDB() {
  // Jika ada koneksi aktif, putuskan dan hapus cache
  if (cachedConnection) {
    await mongoose.disconnect();
    cachedConnection = null;
  }
}
