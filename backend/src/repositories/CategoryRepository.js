import Category from "../models/Category.js";
import BaseRepository from "./BaseRepository.js";

export default class CategoryRepository extends BaseRepository {
  constructor() {
    super(Category);
  }

  findBySlug(slug) {
    return this.findOne({ slug });
  }
}
