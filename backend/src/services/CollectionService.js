// Mengimpor repository dan error handler yang dibutuhkan
import CollectionRepository from "../repositories/CollectionRepository.js";
import ProductRepository from "../repositories/ProductRepository.js";
import ApiError from "../utils/ApiError.js";

// Daftar key produk yang ada pada koleksi
const PRODUCT_KEYS = ["leftProduct", "topRightProduct", "bottomLeftProduct"];

// Service untuk logika bisnis data Koleksi produk di halaman depan
export default class CollectionService {
  // Repository koleksi dan produk (private properties)
  #collectionRepository;
  #productRepository;

  // Constructor dengan dependency injection
  constructor(
    collectionRepository = new CollectionRepository(),
    productRepository = new ProductRepository()
  ) {
    this.#collectionRepository = collectionRepository;
    this.#productRepository = productRepository;
  }

  // Mengambil koleksi aktif, jika belum ada则 buat baru
  async get() {
    const existing = await this.#collectionRepository.findActive();

    // Jika koleksi sudah ada, langsung kembalikan
    if (existing) return existing;

    // Jika belum ada, buat koleksi baru dengan status aktif
    return this.#collectionRepository.create({ active: true });
  }

  // Mengupdate koleksi produk (validasi setiap produk yang dipilih harus ada di database)
  async update(data) {
    // Validasi setiap produk yang dikirim harus ada di database
    for (const key of PRODUCT_KEYS) {
      const productId = data[key];

      if (productId) {
        await this.#assertProductExists(productId);
      }
    }

    // Cari koleksi aktif yang sudah ada
    let collection = await this.#collectionRepository.findActive();

    // Jika belum ada, buat baru
    if (!collection) {
      collection = await this.#collectionRepository.create({ active: true });
    }

    // Update data koleksi (hanya field yang dikirim, sisanya null)
    await this.#collectionRepository.updateById(
      collection._id,
      PRODUCT_KEYS.reduce((payload, key) => {
        payload[key] = data[key] || null;
        return payload;
      }, {})
    );

    // Kembalikan koleksi terbaru
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
