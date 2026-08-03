import CustomerRepository from "../repositories/CustomerRepository.js";
import ApiError from "../utils/ApiError.js";

export default class CustomerService {
  #customerRepository;

  constructor(customerRepository = new CustomerRepository()) {
    this.#customerRepository = customerRepository;
  }

  async list() {
    return this.#customerRepository.findAll();
  }

  async getById(id) {
    const customer = await this.#customerRepository.findById(id);

    if (!customer) {
      throw ApiError.notFound("Pelanggan tidak ditemukan");
    }

    return customer;
  }

  async create(data) {
    if (!data.name) {
      throw ApiError.badRequest("Nama pelanggan wajib diisi", {
        includeSuccess: true,
      });
    }

    return this.#customerRepository.create(data);
  }
}
