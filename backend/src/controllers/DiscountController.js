import DiscountService from "../services/DiscountService.js";

export default class DiscountController {
  #discountService;

  constructor(discountService = new DiscountService()) {
    this.#discountService = discountService;
  }

  list = async (req, res, next) => {
    try {
      const discounts = await this.#discountService.list();

      res.json({ success: true, discounts });
    } catch (error) {
      next(error);
    }
  };

  active = async (req, res, next) => {
    try {
      const discounts = await this.#discountService.listActive();

      res.json({ success: true, discounts });
    } catch (error) {
      next(error);
    }
  };

  byProduct = async (req, res, next) => {
    try {
      const discounts = await this.#discountService.getByProduct(
        req.query.productId
      );

      res.json({ success: true, discounts });
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const discount = await this.#discountService.create(req.body);

      res.status(201).json({ success: true, discount });
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const discount = await this.#discountService.updateById(
        req.params.id,
        req.body
      );

      res.json({ success: true, discount });
    } catch (error) {
      next(error);
    }
  };

  remove = async (req, res, next) => {
    try {
      await this.#discountService.deleteById(req.params.id);

      res.json({ success: true, message: "Diskon berhasil dihapus" });
    } catch (error) {
      next(error);
    }
  };
}
