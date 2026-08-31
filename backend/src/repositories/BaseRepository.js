// Base class Repository untuk operasi database umum (CRUD) yang bisa diwariskan ke repository lain
export default class BaseRepository {
  // Model Mongoose yang digunakan (disimpan sebagai private property)
  #model;

  // Constructor menerima model Mongoose
  constructor(model) {
    this.#model = model;
  }

  // Mencari semua dokumen dengan filter dan opsi sorting (default: urut terbaru)
  findAll(filter = {}, options = {}) {
    return this.#model
      .find(filter)
      .sort(options.sort || { createdAt: -1 });
  }

  // Mencari satu dokumen berdasarkan ID
  findById(id) {
    return this.#model.findById(id).exec();
  }

  // Mencari satu dokumen berdasarkan filter
  findOne(filter) {
    return this.#model.findOne(filter).exec();
  }

  // Membuat dokumen baru
  create(data) {
    return this.#model.create(data);
  }

  // Mengupdate dokumen berdasarkan ID (mengembalikan dokumen yang sudah diupdate)
  updateById(id, data) {
    return this.#model
      .findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .exec();
  }

  // Menghapus dokumen berdasarkan ID
  deleteById(id) {
    return this.#model.findByIdAndDelete(id).exec();
  }

  // Menghitung jumlah dokumen yang cocok dengan filter
  count(filter = {}) {
    return this.#model.countDocuments(filter).exec();
  }
}
