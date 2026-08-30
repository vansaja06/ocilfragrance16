import LimitedOffer from "../models/LimitedOffer.js";
import BaseRepository from "./BaseRepository.js";

const productSelect = "name slug image price category";

export default class LimitedOfferRepository extends BaseRepository {
  constructor() {
    super(LimitedOffer);
  }

  findCurrent() {
    return LimitedOffer.findOne()
      .sort({ createdAt: -1 })
      .populate({
        path: "product",
        select: productSelect,
        populate: { path: "category", select: "name" },
      })
      .exec();
  }
}
