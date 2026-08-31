// Mengimpor repository dan error handler yang dibutuhkan
import BannerRepository from "../repositories/BannerRepository.js";
import ProductRepository from "../repositories/ProductRepository.js";
import ApiError from "../utils/ApiError.js";

// Service untuk logika bisnis data Banner
export default class BannerService {
  // Repository banner dan produk (private properties)
  #bannerRepository;
  #productRepository;

  // Constructor dengan dependency injection
  constructor(
    bannerRepository = new BannerRepository(),
    productRepository = new ProductRepository()
  ) {
    this.#bannerRepository = bannerRepository;
    this.#productRepository = productRepository;
  }

  // Mengambil semua banner
  async list() {
    return this.#bannerRepository.findAll();
  }

  // Mengambil hanya banner yang aktif saja
  async active() {
    return this.#bannerRepository.findActive();
  }

  // Mengambil banner berdasarkan ID, throws error jika tidak ditemukan
  async getById(id) {
    const banner = await this.#bannerRepository.findById(id);

    if (!banner) {
      throw ApiError.notFound("Banner tidak ditemukan");
    }

    return banner;
  }

  // Membuat banner baru dengan validasi: judul wajib diisi, produk harus tersedia
  async create(data) {
    // Validasi judul banner wajib diisi
    if (!data.title) {
      throw ApiError.badRequest("Judul banner wajib diisi", {
        includeSuccess: true,
      });
    }

    // Pastikan produk yang dipilih tersedia di database
    await this.#assertProductAvailable(data.product);

    return this.#bannerRepository.create(data);
  }

  // Mengupdate banner yang sudah ada
  async update(id, data) {
    // Pastikan banner ada
    await this.getById(id);

    // Jika ada produk baru yang dipilih, pastikan produk tersebut ada
    if (data.product) {
      await this.#assertProductExists(data.product);
    }

    return this.#bannerRepository.updateById(id, data);
  }

  // Menghapus banner berdasarkan ID
  async remove(id) {
    await this.getById(id);
    return this.#bannerRepository.deleteById(id);
  }

  // Method private: memastikan produk tersedia untuk membuat banner
  async #assertProductAvailable(productId) {
    // Cek apakah ada produk di database
    const productCount = await this.#productRepository.count();

    if (productCount === 0) {
      throw ApiError.badRequest(
        "Tambahkan produk terlebih dahulu sebelum membuat banner",
        { includeSuccess: true }
      );
    }

    // Validasi productId harus diisi
    if (!productId) {
      throw ApiError.badRequest("Produk untuk banner wajib dipilih", {
        includeSuccess: true,
      });
    }

    // Pastikan produk dengan ID tersebut benar-benar ada
    await this.#assertProductExists(productId);
  }

  // Method private: memastikan produk dengan ID tertentu ada di database
  async #assertProductExists(productId) {
    const product = await this.#productRepository.findById(productId);

    if (!product) {
      throw ApiError.badRequest("Produk tidak ditemukan", {
        includeSuccess: true,
      });
    }
  }
}
