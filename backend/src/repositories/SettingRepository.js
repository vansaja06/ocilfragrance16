// Mengimpor model Setting dan BaseRepository untuk operasi database
import Setting from "../models/Setting.js";
import BaseRepository from "./BaseRepository.js";

// Repository untuk data Pengaturan (warisan dari BaseRepository)
export default class SettingRepository extends BaseRepository {
  // Menginisialisasi dengan model Setting
  constructor() {
    super(Setting);
  }

  // Mencari pengaturan berdasarkan key
  findByKey(key) {
    return this.findOne({ key });
  }

  // Upsert pengaturan: jika key sudah ada则 update, jika belum ada则 buat baru
  async upsert(key, value) {
    // Cek apakah key sudah ada di database
    const existing = await this.findByKey(key);

    // Jika sudah ada, update nilainya
    if (existing) {
      return this.updateById(existing._id, { value });
    }

    // Jika belum ada, buat dokumen baru
    return this.create({ key, value });
  }
}
