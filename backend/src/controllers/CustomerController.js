// Mengimpor service Customer untuk operasi data
import CustomerService from "../services/CustomerService.js";

// Controller untuk menangani data Pelanggan
export default class CustomerController {
  // Service pelanggan (private property)
  #customerService;

  // Constructor dengan dependency injection untuk CustomerService
  constructor(customerService = new CustomerService()) {
    this.#customerService = customerService;
  }

  // Handler untuk mengambil semua pelanggan
  list = async (req, res, next) => {
    try {
      const customers = await this.#customerService.list();
      res.json({ success: true, customers });
    } catch (error) {
      next(error);
    }
  };

  // Handler untuk membuat pelanggan baru (biasanya dipanggil otomatis saat ada order)
  create = async (req, res, next) => {
    try {
      const customer = await this.#customerService.create(req.body);
      res.status(201).json({ success: true, customer });
    } catch (error) {
      next(error);
    }
  };
}
