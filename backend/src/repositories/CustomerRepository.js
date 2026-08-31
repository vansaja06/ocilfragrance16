// Mengimpor model Customer dan BaseRepository untuk operasi database
import Customer from "../models/Customer.js";
import BaseRepository from "./BaseRepository.js";

// Repository untuk data Pelanggan (warisan dari BaseRepository)
export default class CustomerRepository extends BaseRepository {
  // Menginisialisasi dengan model Customer
  constructor() {
    super(Customer);
  }

  // Mencari pelanggan berdasarkan email
  findByEmail(email) {
    return this.findOne({ email });
  }
}
