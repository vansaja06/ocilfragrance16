// Mengimpor service Collection untuk operasi data
import CollectionService from "../services/CollectionService.js";

// Controller untuk menangani data Koleksi produk di halaman depan
export default class CollectionController {
  // Service koleksi (private property)
  #collectionService;

  // Constructor dengan dependency injection untuk CollectionService
  constructor(collectionService = new CollectionService()) {
    this.#collectionService = collectionService;
  }

  // Handler untuk mengambil koleksi produk yang aktif
  get = async (req, res, next) => {
    try {
      const collection = await this.#collectionService.get();
      res.json({ success: true, collection });
    } catch (error) {
      next(error);
    }
  };

  // Handler untuk mengupdate koleksi produk
  update = async (req, res, next) => {
    try {
      const collection = await this.#collectionService.update(req.body);
      res.json({ success: true, collection });
    } catch (error) {
      next(error);
    }
  };
}
