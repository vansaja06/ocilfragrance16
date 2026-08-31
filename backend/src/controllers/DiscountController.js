// Mengimpor service Discount untuk operasi data
import DiscountService from "../services/DiscountService.js";

// Controller untuk menangani CRUD data Diskon
export default class DiscountController {
  // Service diskon (private property)
  #discountService;

  // Constructor dengan dependency injection untuk DiscountService
  constructor(discountService = new DiscountService()) {
    this.#discountService = discountService;
  }

  // Handler untuk mengambil semua diskon
  list = async (req, res, next) => {
    try {
      const discounts = await this.#discountService.list();
      res.json({ success: true, discounts });
    } catch (error) {
      next(error);
    }
  };

  // Handler untuk mengambil hanya diskon yang aktif saja
  active = async (req, res, next) => {
    try {
      const discounts = await this.#discountService.listActive();
      res.json({ success: true, discounts });
    } catch (error) {
      next(error);
    }
  };

  // Handler untuk mengambil diskon berdasarkan produk tertentu
  // Menggunakan query parameter ?productId=...
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

  // Handler untuk membuat diskon baru
  create = async (req, res, next) => {
    try {
      const discount = await this.#discountService.create(req.body);
      res.status(201).json({ success: true, discount });
    } catch (error) {
      next(error);
    }
  };

  // Handler untuk mengupdate diskon berdasarkan ID
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

  // Handler untuk menghapus diskon berdasarkan ID
  remove = async (req, res, next) => {
    try {
      await this.#discountService.deleteById(req.params.id);
      res.json({ success: true, message: "Diskon berhasil dihapus" });
    } catch (error) {
      next(error);
    }
  };
}
