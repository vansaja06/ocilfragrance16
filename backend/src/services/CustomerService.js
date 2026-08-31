// Mengimpor repository dan error handler yang dibutuhkan
import CustomerRepository from "../repositories/CustomerRepository.js";
import ApiError from "../utils/ApiError.js";

// Service untuk logika bisnis data Pelanggan
export default class CustomerService {
  // Repository pelanggan (private property)
  #customerRepository;

  // Constructor dengan dependency injection
  constructor(customerRepository = new CustomerRepository()) {
    this.#customerRepository = customerRepository;
  }

  // Mengambil semua pelanggan
  async list() {
    return this.#customerRepository.findAll();
  }

  // Mengambil pelanggan berdasarkan ID, throws error jika tidak ditemukan
  async getById(id) {
    const customer = await this.#customerRepository.findById(id);

    if (!customer) {
      throw ApiError.notFound("Pelanggan tidak ditemukan");
    }

    return customer;
  }

  // Membuat pelanggan baru (biasanya dipanggil otomatis saat ada order baru)
  async create(data) {
    // Validasi nama pelanggan wajib diisi
    if (!data.name) {
      throw ApiError.badRequest("Nama pelanggan wajib diisi", {
        includeSuccess: true,
      });
    }

    return this.#customerRepository.create(data);
  }
}
