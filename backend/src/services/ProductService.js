import ProductRepository from "../repositories/ProductRepository.js";
import ApiError from "../utils/ApiError.js";

export default class ProductService {
  #productRepository;

  constructor(productRepository = new ProductRepository()) {
    this.#productRepository = productRepository;
  }

  async list() {
    return this.#productRepository.findWithCategory();
  }

  async getById(id) {
    const product = await this.#productRepository.findById(id);

    if (!product) {
      throw ApiError.notFound("Produk tidak ditemukan");
    }

    return product;
  }

  async getBySlug(slug) {
    const product = await this.#productRepository.findBySlug(slug);

    if (!product) {
      throw ApiError.notFound("Produk tidak ditemukan");
    }

    return product;
  }

  async create(data) {
    if (!data.name || data.price === undefined) {
      throw ApiError.badRequest("Nama dan harga wajib diisi", {
        includeSuccess: true,
      });
    }

    return this.#productRepository.create({
      ...data,
      slug: this.#slugify(data.name),
    });
  }

  async update(id, data) {
    await this.getById(id);

    return this.#productRepository.updateById(id, {
      ...data,
      slug: data.name ? this.#slugify(data.name) : undefined,
    });
  }

  async remove(id) {
    await this.getById(id);

    return this.#productRepository.deleteById(id);
  }

  async topSold(limit = 5) {
    return this.#productRepository.findTopSold(limit);
  }

  #slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  }
}
