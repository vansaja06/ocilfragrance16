import Subscriber from "../models/Subscriber.js";
import BaseRepository from "./BaseRepository.js";

export default class SubscriberRepository extends BaseRepository {
  constructor() {
    super(Subscriber);
  }

  findByEmail(email) {
    return this.findOne({ email });
  }

  findApproved() {
    return this.findAll({ status: "Disetujui" });
  }
}
