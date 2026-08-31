// Mengimpor modul path dan url untuk menentukan direktori kerja
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

// Menentukan __dirname karena ES modules tidak menyediakan __dirname secara default
const __dirname = dirname(fileURLToPath(import.meta.url));

// Memuat variabel environment dari file .env
dotenv.config({ path: join(__dirname, "../../.env") });

// Memastikan variabel environment penting sudah diisi
if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  throw new Error("MONGODB_URI dan JWT_SECRET wajib diisi di file .env");
}

// Membuat objek config yang berisi semua pengaturan aplikasi dan dibekukan agar tidak bisa diubah
export default Object.freeze({
  // Port server backend, default 4000
  port: Number(process.env.PORT) || 4000,
  // URL frontend untuk CORS
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  // Koneksi ke database MongoDB
  mongodbUri: process.env.MONGODB_URI,
  // Secret key untuk menandatangani token JWT
  jwtSecret: process.env.JWT_SECRET,
  // Masa berlaku token JWT, default 7 hari
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  // Masa berlaku cookie dalam milidetik (7 hari)
  cookieMaxAge: 60 * 60 * 24 * 7,
});
