// Mengimpor model Banner dan BaseRepository untuk operasi database
import Banner from "../models/Banner.js";
import BaseRepository from "./BaseRepository.js";

// Repository untuk data Banner (warisan dari BaseRepository untuk operasi CRUD umum)
export default class BannerRepository extends BaseRepository {
  // Menginisialisasi dengan model Banner
  constructor() {
    super(Banner);
  }

  // Mengambil semua banner beserta data produk yang direferensikan (populate)
  findAll(filter = {}, options = {}) {
    return super
      .findAll(filter, options)
      // Populate data product: hanya ambil field name, slug, price, image, stock
      .populate("product", "name slug price image stock");
  }

  // Mencari banner yang statusnya aktif saja
  findActive() {
    return this.findAll({ active: true });
  }
}
