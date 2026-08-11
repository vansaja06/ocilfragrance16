import CollectionRepository from "../repositories/CollectionRepository.js";
import ProductRepository from "../repositories/ProductRepository.js";
import ApiError from "../utils/ApiError.js";

const PRODUCT_KEYS = ["leftProduct", "topRightProduct", "bottomLeftProduct"];

export default class CollectionService {
  #collectionRepository;
  #productRepository;

  constructor(
    collectionRepository = new CollectionRepository(),
    productRepository = new ProductRepository()
  ) {
    this.#collectionRepository = collectionRepository;
    this.#productRepository = productRepository;
  }

  async get() {
    const existing = await this.#collectionRepository.findActive();

    if (existing) return existing;

    return this.#collectionRepository.create({ active: true });
  }

  async update(data) {
    for (const key of PRODUCT_KEYS) {
      const productId = data[key];

      if (productId) {
        await this.#assertProductExists(productId);
      }
    }

    let collection = await this.#collectionRepository.findActive();

    if (!collection) {
      collection = await this.#collectionRepository.create({ active: true });
    }

    await this.#collectionRepository.updateById(
      collection._id,
      PRODUCT_KEYS.reduce((payload, key) => {
        payload[key] = data[key] || null;

        return payload;
      }, {})
    );

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
