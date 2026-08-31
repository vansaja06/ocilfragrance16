// Mengimpor model Order dan BaseRepository untuk operasi database
import Order from "../models/Order.js";
import BaseRepository from "./BaseRepository.js";

// Repository untuk data Pesanan/Order (warisan dari BaseRepository)
export default class OrderRepository extends BaseRepository {
  // Menginisialisasi dengan model Order
  constructor() {
    super(Order);
  }

  // Mencari pesanan terbaru dengan batas jumlah (default 5)
  findRecent(limit = 5) {
    return this.findAll().limit(limit).exec();
  }

  // Mencari semua pesanan dengan detail item produk yang di-populate
  findWithDetails() {
    return this.findAll().populate("items.product", "name image").exec();
  }

  // Menghitung total pendapatan dari seluruh pesanan menggunakan MongoDB aggregation
  sumTotal() {
    return Order.aggregate([
      {
        $group: {
          _id: null,
          // Menjumlahkan semua field "total" dari seluruh dokumen
          revenue: { $sum: "$total" },
        },
      },
    ]).exec();
  }
}
