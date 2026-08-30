import LimitedOfferRepository from "../repositories/LimitedOfferRepository.js";
import ProductRepository from "../repositories/ProductRepository.js";
import ApiError from "../utils/ApiError.js";

const TEXT_KEYS = ["label", "discountText", "description", "buttonText"];

export default class LimitedOfferService {
  #limitedOfferRepository;
  #productRepository;

  constructor(
    limitedOfferRepository = new LimitedOfferRepository(),
    productRepository = new ProductRepository()
  ) {
    this.#limitedOfferRepository = limitedOfferRepository;
    this.#productRepository = productRepository;
  }

  async get() {
    const existing = await this.#limitedOfferRepository.findCurrent();

    if (existing) return existing;

    return this.#limitedOfferRepository.create({ active: true });
  }

  async update(data) {
    if (data.product) {
      await this.#assertProductExists(data.product);
    }

    let offer = await this.#limitedOfferRepository.findCurrent();

    if (!offer) {
      offer = await this.#limitedOfferRepository.create({ active: true });
    }

    const payload = { product: data.product || null };

    for (const key of TEXT_KEYS) {
      if (typeof data[key] === "string") {
        payload[key] = data[key].trim();
      }
    }

    if (typeof data.active === "boolean") {
      payload.active = data.active;
    }

    await this.#limitedOfferRepository.updateById(offer._id, payload);

    return this.get();
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
