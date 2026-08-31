// Mengimpor model LimitedOffer dan BaseRepository untuk operasi database
import LimitedOffer from "../models/LimitedOffer.js";
import BaseRepository from "./BaseRepository.js";

// Field produk yang akan diambil saat populate
const productSelect = "name slug image price category";

// Repository untuk data Penawaran Terbatas (warisan dari BaseRepository)
export default class LimitedOfferRepository extends BaseRepository {
  // Menginisialisasi dengan model LimitedOffer
  constructor() {
    super(LimitedOffer);
  }

  // Mencari penawaran terbatas terbaru (urutkan dari yang paling baru) beserta data produk
  findCurrent() {
    return LimitedOffer.findOne()
      .sort({ createdAt: -1 })
      // Populate data produk beserta kategorinya
      .populate({
        path: "product",
        select: productSelect,
        populate: { path: "category", select: "name" },
      })
      .exec();
  }
}
