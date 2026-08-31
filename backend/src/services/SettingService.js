// Mengimpor repository untuk operasi data
import SettingRepository from "../repositories/SettingRepository.js";

// Nilai default untuk pengaturan toko (akan di-merge dengan data dari client)
const DEFAULT_SETTINGS = {
  storeName: "Ocil Fragrance",    // Nama toko
  tagline: "The Essence of Elegance", // Tagline toko
  email: "",                       // Email toko
  phone: "",                       // Telepon toko
  address: "",                     // Alamat toko
  instagram: "",                   // Akun Instagram
  twitter: "",                     // Akun Twitter
  facebook: "",                    // Akun Facebook
  qrisImage: "",                   // URL gambar QRIS pembayaran
  bankAccount: "",                 // Info rekening bank
};

// Service untuk logika bisnis data Pengaturan toko
export default class SettingService {
  // Repository pengaturan (private property)
  #settingRepository;

  // Constructor dengan dependency injection
  constructor(settingRepository = new SettingRepository()) {
    this.#settingRepository = settingRepository;
  }

  // Mengambil semua pengaturan toko (key: "general")
  async getAll() {
    // Mencari record dengan key "general"
    const [record] = await this.#settingRepository.findAll({ key: "general" });

    // Kembalikan value atau object kosong jika belum ada
    return record?.value || {};
  }

  // Mengupdate pengaturan toko (merge dengan default settings)
  async update(payload) {
    // Merge default settings dengan payload dari client
    // Field yang tidak dikirim akan tetap menggunakan nilai default
    const value = { ...DEFAULT_SETTINGS, ...payload };

    // Upsert: update jika sudah ada, buat baru jika belum
    await this.#settingRepository.upsert("general", value);

    return value;
  }
}
