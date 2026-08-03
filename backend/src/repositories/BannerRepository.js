import Banner from "../models/Banner.js";
import BaseRepository from "./BaseRepository.js";

export default class BannerRepository extends BaseRepository {
  constructor() {
    super(Banner);
  }

  findActive() {
    return this.findAll({ active: true });
  }
}
