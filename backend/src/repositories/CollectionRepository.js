// Mengimpor model Collection dan BaseRepository untuk operasi database
import Collection from "../models/Collection.js";
import BaseRepository from "./BaseRepository.js";

// Field produk yang akan diambil saat populate (menghemat data yang dikirim)
const productSelect = "name slug image price category";

// Repository untuk data Koleksi (warisan dari BaseRepository)
export default class CollectionRepository extends BaseRepository {
  // Menginisialisasi dengan model Collection
  constructor() {
    super(Collection);
  }

  // Mencari koleksi aktif dengan mengisi (populate) data produk pada setiap posisi
  // termasuk mengisi data kategori dari setiap produk
  findActive() {
    return Collection.findOne({ active: true })
      // Populate produk di posisi kiri
      .populate({
        path: "leftProduct",
        select: productSelect,
        populate: { path: "category", select: "name" },
      })
      // Populate produk di posisi kanan atas
      .populate({
        path: "topRightProduct",
        select: productSelect,
        populate: { path: "category", select: "name" },
      })
      // Populate produk di posisi kiri bawah
      .populate({
        path: "bottomLeftProduct",
        select: productSelect,
        populate: { path: "category", select: "name" },
      })
      .exec();
  }
}
