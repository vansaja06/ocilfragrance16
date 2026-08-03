import OrderRepository from "../repositories/OrderRepository.js";
import ApiError from "../utils/ApiError.js";

export default class OrderService {
  #orderRepository;

  constructor(orderRepository = new OrderRepository()) {
    this.#orderRepository = orderRepository;
  }

  async list() {
    return this.#orderRepository.findWithDetails();
  }

  async recent(limit = 5) {
    return this.#orderRepository.findRecent(limit);
  }

  async getById(id) {
    const order = await this.#orderRepository.findById(id);

    if (!order) {
      throw ApiError.notFound("Pesanan tidak ditemukan");
    }

    return order;
  }

  async updateStatus(id, { status }) {
    if (!status) {
      throw ApiError.badRequest("Status wajib diisi", {
        includeSuccess: true,
      });
    }

    await this.getById(id);

    return this.#orderRepository.updateById(id, { status });
  }

  async revenue() {
    const [result] = await this.#orderRepository.sumTotal();

    return result?.revenue || 0;
  }
}
