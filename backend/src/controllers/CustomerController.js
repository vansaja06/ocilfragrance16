import CustomerService from "../services/CustomerService.js";

export default class CustomerController {
  #customerService;

  constructor(customerService = new CustomerService()) {
    this.#customerService = customerService;
  }

  list = async (req, res, next) => {
    try {
      const customers = await this.#customerService.list();

      res.json({ success: true, customers });
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const customer = await this.#customerService.create(req.body);

      res.status(201).json({ success: true, customer });
    } catch (error) {
      next(error);
    }
  };
}
