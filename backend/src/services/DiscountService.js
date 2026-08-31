// Mengimpor repository dan error handler yang dibutuhkan
import DiscountRepository from "../repositories/DiscountRepository.js";
import ApiError from "../utils/ApiError.js";

// Service untuk logika bisnis data Diskon
export default class DiscountService {
  // Repository diskon (private property)
  #discountRepository;

  // Constructor dengan dependency injection
  constructor(discountRepository = new DiscountRepository()) {
    this.#discountRepository = discountRepository;
  }

  // Mengambil semua diskon
  async list() {
    return this.#discountRepository.findAll();
  }

  // Mengambil hanya diskon yang aktif saja
  async listActive() {
    return this.#discountRepository.findActive();
  }

  // Mengambil diskon berdasarkan produk: jika ada diskon khusus produk, kembalikan itu;
  // jika tidak ada, kembalikan diskon global (berlaku untuk semua produk)
  async getByProduct(productId) {
    if (productId) {
      const specific = await this.#discountRepository.findByProduct(productId);

      // Jika ada diskon khusus produk, kembalikan diskon tersebut
      if (specific.length > 0) return specific;
    }

    // Jika tidak ada diskon khusus, kembalikan diskon global
    return this.#discountRepository.findGlobal();
  }

  // Membuat diskon baru dengan validasi: nama dan persentase wajib diisi
  async create(data) {
    const { name, percentage, productId } = data || {};

    if (!name || !percentage) {
      throw ApiError.badRequest("Nama dan persentase diskon wajib diisi", {
        includeSuccess: true,
      });
    }

    return this.#discountRepository.create({
      name,
      percentage: Number(percentage), // Konversi ke number
      productId: productId || null,    // null = diskon global
      active: true,
    });
  }

  // Mengupdate diskon berdasarkan ID
  async updateById(id, data) {
    const discount = await this.#discountRepository.findById(id);

    if (!discount) {
      throw ApiError.notFound("Diskon tidak ditemukan");
    }

    return this.#discountRepository.updateById(id, data);
  }

  // Menghapus diskon berdasarkan ID
  async deleteById(id) {
    const discount = await this.#discountRepository.findById(id);

    if (!discount) {
      throw ApiError.notFound("Diskon tidak ditemukan");
    }

    return this.#discountRepository.deleteById(id);
  }
}
