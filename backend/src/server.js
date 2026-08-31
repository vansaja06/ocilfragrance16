// Mengimpor aplikasi Express dan konfigurasi
import app from "./app.js";
import config from "./config/index.js";
// Mengimpor fungsi untuk menghubungkan ke database
import { connectDB } from "./config/database.js";

// Fungsi utama untuk menjalankan server
async function startServer() {
  try {
    // Menghubungkan ke database MongoDB terlebih dahulu sebelum menjalankan server
    await connectDB();

    // Menjalankan server Express pada port yang sudah dikonfigurasi
    app.listen(config.port, () => {
      console.log(`Server running on http://localhost:${config.port}`);
    });
  } catch (error) {
    // Jika gagal, tampilkan error dan hentikan proses
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Menjalankan fungsi startServer
startServer();
