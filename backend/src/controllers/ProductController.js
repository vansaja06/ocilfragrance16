// Mengimpor service Product untuk operasi data
import ProductService from "../services/ProductService.js";

// Controller untuk menangani CRUD data Produk
export default class ProductController {
  // Service produk (private property)
  #productService;

  // Constructor dengan dependency injection untuk ProductService
  constructor(productService = new ProductService()) {
    this.#productService = productService;
  }

  // Handler untuk mengambil semua produk
  list = async (req, res, next) => {
    try {
      const products = await this.#productService.list();
      res.json({ success: true, products });
    } catch (error) {
      next(error);
    }
  };

  // Handler untuk mengambil detail produk berdasarkan slug (atau ID)
  getBySlug = async (req, res, next) => {
    try {
      const product = await this.#productService.getBySlug(req.params.slug);
      res.json({ success: true, product });
    } catch (error) {
      next(error);
    }
  };

  // Handler untuk membuat produk baru
  create = async (req, res, next) => {
    try {
      const product = await this.#productService.create(req.body);
      res.status(201).json({ success: true, product });
    } catch (error) {
      next(error);
    }
  };

  // Handler untuk mengupdate produk berdasarkan ID
  update = async (req, res, next) => {
    try {
      const product = await this.#productService.update(
        req.params.id,
        req.body
      );
      res.json({ success: true, product });
    } catch (error) {
      next(error);
    }
  };

  // Handler untuk menghapus produk berdasarkan ID
  remove = async (req, res, next) => {
    try {
      await this.#productService.remove(req.params.id);
      res.json({ success: true, message: "Produk dihapus" });
    } catch (error) {
      next(error);
    }
  };
}
