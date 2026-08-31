// Mengimpor repository dan error handler yang dibutuhkan
import ProductRepository from "../repositories/ProductRepository.js";
import ApiError from "../utils/ApiError.js";

// Service untuk logika bisnis data Produk
export default class ProductService {
  // Repository produk (private property)
  #productRepository;

  // Constructor dengan dependency injection
  constructor(productRepository = new ProductRepository()) {
    this.#productRepository = productRepository;
  }

  // Mengambil semua produk beserta data kategori yang di-populate
  async list() {
    return this.#productRepository.findWithCategory();
  }

  // Mengambil produk berdasarkan ID
  async getById(id) {
    const product = await this.#productRepository.findById(id);

    if (!product) {
      throw ApiError.notFound("Produk tidak ditemukan");
    }

    return product;
  }

  // Mengambil produk berdasarkan slug atau ID
  async getBySlug(slug) {
    const product = await this.#productRepository.findBySlug(slug);

    if (!product) {
      throw ApiError.notFound("Produk tidak ditemukan");
    }

    return product;
  }

  // Membuat produk baru dengan validasi: nama dan harga wajib diisi
  async create(data) {
    if (!data.name || data.price === undefined) {
      throw ApiError.badRequest("Nama dan harga wajib diisi", {
        includeSuccess: true,
      });
    }

    // Simpan produk dengan slug otomatis dari nama
    return this.#productRepository.create({
      ...data,
      slug: this.#slugify(data.name),
    });
  }

  // Mengupdate produk yang sudah ada
  async update(id, data) {
    // Pastikan produk ada
    await this.getById(id);

    // Update produk, regenerate slug jika nama berubah
    return this.#productRepository.updateById(id, {
      ...data,
      slug: data.name ? this.#slugify(data.name) : undefined,
    });
  }

  // Menghapus produk berdasarkan ID
  async remove(id) {
    await this.getById(id);
    return this.#productRepository.deleteById(id);
  }

  // Mengambil produk terlaris berdasarkan jumlah terjual
  async topSold(limit = 5) {
    return this.#productRepository.findTopSold(limit);
  }

  // Method private: mengubah teks menjadi slug URL-friendly
  // Contoh: "Aventus 100ml" → "aventus-100ml"
  #slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // Hapus karakter spesial
      .replace(/\s+/g, "-");         // Ganti spasi dengan strip
  }
}
