// Mengimpor mongoose untuk validasi ObjectId, model Product, dan BaseRepository
import mongoose from "mongoose";
import Product from "../models/Product.js";
import BaseRepository from "./BaseRepository.js";

// Repository untuk data Produk (warisan dari BaseRepository)
export default class ProductRepository extends BaseRepository {
  // Menginisialisasi dengan model Product
  constructor() {
    super(Product);
  }

  // Mencari produk berdasarkan slug atau ID
  // Mendukung pencarian baik menggunakan slug maupun ObjectId
  findBySlug(slug) {
    // Jika slug adalah ObjectId yang valid, cari berdasarkan slug ATAU _id
    const filter = mongoose.isValidObjectId(slug)
      ? { $or: [{ slug }, { _id: slug }] }
      : { slug };

    // Populate kategori produk dan ambil dokumen pertama
    return this.findAll(filter)
      .populate("category", "name")
      .exec()
      .then((docs) => docs[0]);
  }

  // Mencari produk terlaris (yang sudah terjual > 0), urutkan dari yang paling banyak terjual
  findTopSold(limit = 5) {
    return this.findAll({ sold: { $gt: 0 } }, { sort: { sold: -1 } })
      .limit(limit)
      .populate("category", "name")
      .exec();
  }

  // Mengambil semua produk dengan data kategori yang di-populate
  findWithCategory() {
    return this.findAll().populate("category", "name").exec();
  }
}
