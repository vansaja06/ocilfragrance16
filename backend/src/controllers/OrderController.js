// Mengimpor service Order untuk operasi data
import OrderService from "../services/OrderService.js";

// Controller untuk menangani CRUD data Pesanan/Order
export default class OrderController {
  // Service pesanan (private property)
  #orderService;

  // Constructor dengan dependency injection untuk OrderService
  constructor(orderService = new OrderService()) {
    this.#orderService = orderService;
  }

  // Handler untuk mengambil semua pesanan, mendukung query ?limit= untuk batas jumlah
  list = async (req, res, next) => {
    try {
      const orders = await this.#orderService.list(req.query);
      res.json({ success: true, orders });
    } catch (error) {
      next(error);
    }
  };

  // Handler untuk membuat pesanan baru dari data yang dikirim client
  create = async (req, res, next) => {
    try {
      const order = await this.#orderService.create(req.body);
      res.status(201).json({ success: true, order });
    } catch (error) {
      next(error);
    }
  };

  // Handler untuk mengambil detail pesanan berdasarkan ID
  getById = async (req, res, next) => {
    try {
      const order = await this.#orderService.getById(req.params.id);
      res.json({ success: true, order });
    } catch (error) {
      next(error);
    }
  };

  // Handler untuk mengupdate status pesanan (Menunggu/Diproses/Selesai/Dibatalkan)
  updateStatus = async (req, res, next) => {
    try {
      const order = await this.#orderService.updateStatus(
        req.params.id,
        req.body
      );
      res.json({ success: true, order });
    } catch (error) {
      next(error);
    }
  };
}
