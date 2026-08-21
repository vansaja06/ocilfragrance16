import Discount from "../models/Discount.js";
import BaseRepository from "./BaseRepository.js";

export default class DiscountRepository extends BaseRepository {
  constructor() {
    super(Discount);
  }

  findActive() {
    return this.findAll({ active: true });
  }

  findByProduct(productId) {
    return this.findAll({ productId, active: true });
  }

  findGlobal() {
    return this.findAll({ productId: null, active: true });
  }
}
