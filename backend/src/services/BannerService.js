import BannerRepository from "../repositories/BannerRepository.js";
import ProductRepository from "../repositories/ProductRepository.js";
import ApiError from "../utils/ApiError.js";

export default class BannerService {
  #bannerRepository;
  #productRepository;

  constructor(
    bannerRepository = new BannerRepository(),
    productRepository = new ProductRepository()
  ) {
    this.#bannerRepository = bannerRepository;
    this.#productRepository = productRepository;
  }

  async list() {
    return this.#bannerRepository.findAll();
  }

  async active() {
    return this.#bannerRepository.findActive();
  }

  async getById(id) {
    const banner = await this.#bannerRepository.findById(id);

    if (!banner) {
      throw ApiError.notFound("Banner tidak ditemukan");
    }

    return banner;
  }

  async create(data) {
    if (!data.title) {
      throw ApiError.badRequest("Judul banner wajib diisi", {
        includeSuccess: true,
      });
    }

    await this.#assertProductAvailable(data.product);

    return this.#bannerRepository.create(data);
  }

  async update(id, data) {
    await this.getById(id);

    if (data.product) {
      await this.#assertProductExists(data.product);
    }

    return this.#bannerRepository.updateById(id, data);
  }

  async remove(id) {
    await this.getById(id);

    return this.#bannerRepository.deleteById(id);
  }

  async #assertProductAvailable(productId) {
    const productCount = await this.#productRepository.count();

    if (productCount === 0) {
      throw ApiError.badRequest(
        "Tambahkan produk terlebih dahulu sebelum membuat banner",
        { includeSuccess: true }
      );
    }

    if (!productId) {
      throw ApiError.badRequest("Produk untuk banner wajib dipilih", {
        includeSuccess: true,
      });
    }

    await this.#assertProductExists(productId);
  }

  async #assertProductExists(productId) {
    const product = await this.#productRepository.findById(productId);

    if (!product) {
      throw ApiError.badRequest("Produk tidak ditemukan", {
        includeSuccess: true,
      });
    }
  }
}
