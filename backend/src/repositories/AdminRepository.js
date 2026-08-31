// Mengimpor model Admin untuk operasi database
import Admin from "../models/Admin.js";

// Repository untuk data Admin (akun administrator)
export default class AdminRepository {
  // Model yang digunakan adalah Admin
  #model = Admin;

  // Mencari admin berdasarkan email
  findByEmail(email) {
    return this.#model.findOne({ email }).exec();
  }

  // Membuat admin baru
  createAdmin(data) {
    return this.#model.create(data);
  }
}
