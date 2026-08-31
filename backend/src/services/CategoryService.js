// Mengimpor repository dan error handler yang dibutuhkan
import CategoryRepository from "../repositories/CategoryRepository.js";
import ApiError from "../utils/ApiError.js";

// Service untuk logika bisnis data Kategori
export default class CategoryService {
  // Repository kategori (private property)
  #categoryRepository;

  // Constructor dengan dependency injection
  constructor(categoryRepository = new CategoryRepository()) {
    this.#categoryRepository = categoryRepository;
  }

  // Mengambil semua kategori
  async list() {
    return this.#categoryRepository.findAll();
  }

  // Mengambil kategori berdasarkan ID, throws error jika tidak ditemukan
  async getById(id) {
    const category = await this.#categoryRepository.findById(id);

    if (!category) {
      throw ApiError.notFound("Kategori tidak ditemukan");
    }

    return category;
  }

  // Membuat kategori baru dengan validasi: nama wajib diisi, tidak boleh duplikat
  async create({ name, description }) {
    // Validasi nama kategori wajib diisi
    if (!name) {
      throw ApiError.badRequest("Nama kategori wajib diisi", {
        includeSuccess: true,
      });
    }

    // Cek apakah kategori dengan slug yang sama sudah ada
    const existing = await this.#categoryRepository.findBySlug(
      this.#slugify(name)
    );

    if (existing) {
      throw ApiError.badRequest("Kategori sudah ada", {
        includeSuccess: true,
      });
    }

    // Simpan kategori baru dengan slug otomatis dari nama
    return this.#categoryRepository.create({
      name,
      slug: this.#slugify(name),
      description: description || "",
    });
  }

  // Menghapus kategori berdasarkan ID (pastikan kategori ada terlebih dahulu)
  async remove(id) {
    await this.getById(id);
    return this.#categoryRepository.deleteById(id);
  }

  // Method private: mengubah teks menjadi slug URL-friendly
  // Contoh: "Parfum Pria" → "parfum-pria"
  #slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // Hapus karakter spesial
      .replace(/\s+/g, "-");         // Ganti spasi dengan strip
  }
}
