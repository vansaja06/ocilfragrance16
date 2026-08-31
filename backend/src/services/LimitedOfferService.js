// Mengimpor repository dan error handler yang dibutuhkan
import LimitedOfferRepository from "../repositories/LimitedOfferRepository.js";
import ProductRepository from "../repositories/ProductRepository.js";
import ApiError from "../utils/ApiError.js";

// Daftar field teks yang bisa diupdate pada penawaran terbatas
const TEXT_KEYS = ["label", "discountText", "description", "buttonText"];

// Service untuk logika bisnis data Penawaran Terbatas (Limited Offer)
export default class LimitedOfferService {
  // Repository penawaran terbatas dan produk (private properties)
  #limitedOfferRepository;
  #productRepository;

  // Constructor dengan dependency injection
  constructor(
    limitedOfferRepository = new LimitedOfferRepository(),
    productRepository = new ProductRepository()
  ) {
    this.#limitedOfferRepository = limitedOfferRepository;
    this.#productRepository = productRepository;
  }

  // Mengambil penawaran terbatas saat ini, jika belum ada则 buat baru
  async get() {
    const existing = await this.#limitedOfferRepository.findCurrent();

    // Jika sudah ada, langsung kembalikan
    if (existing) return existing;

    // Jika belum ada, buat penawaran baru dengan status aktif
    return this.#limitedOfferRepository.create({ active: true });
  }

  // Mengupdate data penawaran terbatas
  async update(data) {
    // Jika ada produk yang dipilih, pastikan produk tersebut ada
    if (data.product) {
      await this.#assertProductExists(data.product);
    }

    // Cari penawaran yang sudah ada
    let offer = await this.#limitedOfferRepository.findCurrent();

    // Jika belum ada, buat baru
    if (!offer) {
      offer = await this.#limitedOfferRepository.create({ active: true });
    }

    // Siapkan payload update: produk
    const payload = { product: data.product || null };

    // Update field teks yang dikirim (trim spasi)
    for (const key of TEXT_KEYS) {
      if (typeof data[key] === "string") {
        payload[key] = data[key].trim();
      }
    }

    // Update status aktif jika dikirim
    if (typeof data.active === "boolean") {
      payload.active = data.active;
    }

    // Simpan perubahan
    await this.#limitedOfferRepository.updateById(offer._id, payload);

    // Kembalikan data terbaru
    return this.get();
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
