// Mengimpor model Discount dan BaseRepository untuk operasi database
import Discount from "../models/Discount.js";
import BaseRepository from "./BaseRepository.js";

// Repository untuk data Diskon (warisan dari BaseRepository)
export default class DiscountRepository extends BaseRepository {
  // Menginisialisasi dengan model Discount
  constructor() {
    super(Discount);
  }

  // Mencari diskon yang aktif saja
  findActive() {
    return this.findAll({ active: true });
  }

  // Mencari diskon yang diterapkan pada produk tertentu dan aktif
  findByProduct(productId) {
    return this.findAll({ productId, active: true });
  }

  // Mencari diskon global (berlaku untuk semua produk, productId = null) yang aktif
  findGlobal() {
    return this.findAll({ productId: null, active: true });
  }
}
