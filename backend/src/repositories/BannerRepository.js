import Banner from "../models/Banner.js";
import BaseRepository from "./BaseRepository.js";

export default class BannerRepository extends BaseRepository {
  constructor() {
    super(Banner);
  }

  findAll(filter = {}, options = {}) {
    return super
      .findAll(filter, options)
      .populate("product", "name slug price image stock");
  }

  findActive() {
    return this.findAll({ active: true });
  }
}
