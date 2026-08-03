import OrderService from "../services/OrderService.js";

export default class OrderController {
  #orderService;

  constructor(orderService = new OrderService()) {
    this.#orderService = orderService;
  }

  list = async (req, res, next) => {
    try {
      const orders = await this.#orderService.list();

      res.json({ success: true, orders });
    } catch (error) {
      next(error);
    }
  };

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
