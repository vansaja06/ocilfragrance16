import Collection from "../models/Collection.js";
import BaseRepository from "./BaseRepository.js";

const productSelect = "name slug image price category";

export default class CollectionRepository extends BaseRepository {
  constructor() {
    super(Collection);
  }

  findActive() {
    return Collection.findOne({ active: true })
      .populate({
        path: "leftProduct",
        select: productSelect,
        populate: { path: "category", select: "name" },
      })
      .populate({
        path: "topRightProduct",
        select: productSelect,
        populate: { path: "category", select: "name" },
      })
      .populate({
        path: "bottomLeftProduct",
        select: productSelect,
        populate: { path: "category", select: "name" },
      })
      .exec();
  }
}
