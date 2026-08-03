import ProductService from "../services/ProductService.js";

export default class ProductController {
  #productService;

  constructor(productService = new ProductService()) {
    this.#productService = productService;
  }

  list = async (req, res, next) => {
    try {
      const products = await this.#productService.list();

      res.json({ success: true, products });
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const product = await this.#productService.create(req.body);

      res.status(201).json({ success: true, product });
    } catch (error) {
      next(error);
    }
  };

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

  remove = async (req, res, next) => {
    try {
      await this.#productService.remove(req.params.id);

      res.json({ success: true, message: "Produk dihapus" });
    } catch (error) {
      next(error);
    }
  };
}
