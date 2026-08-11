import mongoose from "mongoose";
import Product from "../models/Product.js";
import BaseRepository from "./BaseRepository.js";

export default class ProductRepository extends BaseRepository {
  constructor() {
    super(Product);
  }

  findBySlug(slug) {
    const filter = mongoose.isValidObjectId(slug)
      ? { $or: [{ slug }, { _id: slug }] }
      : { slug };

    return this.findAll(filter)
      .populate("category", "name")
      .exec()
      .then((docs) => docs[0]);
  }

  findTopSold(limit = 5) {
    return this.findAll({ sold: { $gt: 0 } }, { sort: { sold: -1 } })
      .limit(limit)
      .populate("category", "name")
      .exec();
  }

  findWithCategory() {
    return this.findAll().populate("category", "name").exec();
  }
}
