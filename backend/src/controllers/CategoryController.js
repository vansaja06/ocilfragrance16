// Mengimpor service Category untuk operasi data
import CategoryService from "../services/CategoryService.js";

// Controller untuk menangani CRUD data Kategori
export default class CategoryController {
  // Service kategori (private property)
  #categoryService;

  // Constructor dengan dependency injection untuk CategoryService
  constructor(categoryService = new CategoryService()) {
    this.#categoryService = categoryService;
  }

  // Handler untuk mengambil semua kategori
  list = async (req, res, next) => {
    try {
      const categories = await this.#categoryService.list();
      res.json({ success: true, categories });
    } catch (error) {
      next(error);
    }
  };

  // Handler untuk membuat kategori baru
  create = async (req, res, next) => {
    try {
      const category = await this.#categoryService.create(req.body);
      res.status(201).json({ success: true, category });
    } catch (error) {
      next(error);
    }
  };

  // Handler untuk menghapus kategori berdasarkan ID
  remove = async (req, res, next) => {
    try {
      await this.#categoryService.remove(req.params.id);
      res.json({ success: true, message: "Kategori dihapus" });
    } catch (error) {
      next(error);
    }
  };
}
