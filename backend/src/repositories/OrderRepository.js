import Order from "../models/Order.js";
import BaseRepository from "./BaseRepository.js";

export default class OrderRepository extends BaseRepository {
  constructor() {
    super(Order);
  }

  findRecent(limit = 5) {
    return this.findAll().limit(limit).exec();
  }

  findWithDetails() {
    return this.findAll().populate("items.product", "name image").exec();
  }

  sumTotal() {
    return Order.aggregate([
      {
        $group: {
          _id: null,
          revenue: { $sum: "$total" },
        },
      },
    ]).exec();
  }
}
