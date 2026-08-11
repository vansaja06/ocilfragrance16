import Subscriber from "../models/Subscriber.js";
import BaseRepository from "./BaseRepository.js";

export default class SubscriberRepository extends BaseRepository {
  constructor() {
    super(Subscriber);
  }
}
