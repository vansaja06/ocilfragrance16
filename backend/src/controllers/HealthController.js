// Mengimpor fungsi koneksi database
import { connectDB } from "../config/database.js";

// Controller untuk health check (menguji koneksi ke database)
export default class HealthController {
  // Handler untuk menguji koneksi ke MongoDB
  testDb = async (req, res) => {
    try {
      // Mencoba menghubungkan ke database
      await connectDB();
      res.json({ success: true, message: "MongoDB Connected!" });
    } catch (error) {
      // Jika gagal, panggil handler error internal
      this.#handleError(res, error);
    }
  };

  // Method private untuk menangani error dan mengirim response 500
  #handleError(res, error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to connect database" });
  }
}
