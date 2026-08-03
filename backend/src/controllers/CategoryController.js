import CategoryService from "../services/CategoryService.js";

export default class CategoryController {
  #categoryService;

  constructor(categoryService = new CategoryService()) {
    this.#categoryService = categoryService;
  }

  list = async (req, res, next) => {
    try {
      const categories = await this.#categoryService.list();

      res.json({ success: true, categories });
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const category = await this.#categoryService.create(req.body);

      res.status(201).json({ success: true, category });
    } catch (error) {
      next(error);
    }
  };

  remove = async (req, res, next) => {
    try {
      await this.#categoryService.remove(req.params.id);

      res.json({ success: true, message: "Kategori dihapus" });
    } catch (error) {
      next(error);
    }
  };
}
