// Mengimpor model Category dan BaseRepository untuk operasi database
import Category from "../models/Category.js";
import BaseRepository from "./BaseRepository.js";

// Repository untuk data Kategori (warisan dari BaseRepository)
export default class CategoryRepository extends BaseRepository {
  // Menginisialisasi dengan model Category
  constructor() {
    super(Category);
  }

  // Mencari kategori berdasarkan slug
  findBySlug(slug) {
    return this.findOne({ slug });
  }
}
