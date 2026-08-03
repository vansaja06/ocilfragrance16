import Setting from "../models/Setting.js";
import BaseRepository from "./BaseRepository.js";

export default class SettingRepository extends BaseRepository {
  constructor() {
    super(Setting);
  }

  findByKey(key) {
    return this.findOne({ key });
  }

  async upsert(key, value) {
    const existing = await this.findByKey(key);

    if (existing) {
      return this.updateById(existing._id, { value });
    }

    return this.create({ key, value });
  }
}
