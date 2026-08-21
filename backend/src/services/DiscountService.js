import DiscountRepository from "../repositories/DiscountRepository.js";
import ApiError from "../utils/ApiError.js";

export default class DiscountService {
  #discountRepository;

  constructor(discountRepository = new DiscountRepository()) {
    this.#discountRepository = discountRepository;
  }

  async list() {
    return this.#discountRepository.findAll();
  }

  async listActive() {
    return this.#discountRepository.findActive();
  }

  async getByProduct(productId) {
    if (productId) {
      const specific = await this.#discountRepository.findByProduct(productId);

      if (specific.length > 0) return specific;
    }

    return this.#discountRepository.findGlobal();
  }

  async create(data) {
    const { name, percentage, productId } = data || {};

    if (!name || !percentage) {
      throw ApiError.badRequest("Nama dan persentase diskon wajib diisi", {
        includeSuccess: true,
      });
    }

    return this.#discountRepository.create({
      name,
      percentage: Number(percentage),
      productId: productId || null,
      active: true,
    });
  }

  async updateById(id, data) {
    const discount = await this.#discountRepository.findById(id);

    if (!discount) {
      throw ApiError.notFound("Diskon tidak ditemukan");
    }

    return this.#discountRepository.updateById(id, data);
  }

  async deleteById(id) {
    const discount = await this.#discountRepository.findById(id);

    if (!discount) {
      throw ApiError.notFound("Diskon tidak ditemukan");
    }

    return this.#discountRepository.deleteById(id);
  }
}
