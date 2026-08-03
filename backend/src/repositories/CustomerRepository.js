import Customer from "../models/Customer.js";
import BaseRepository from "./BaseRepository.js";

export default class CustomerRepository extends BaseRepository {
  constructor() {
    super(Customer);
  }

  findByEmail(email) {
    return this.findOne({ email });
  }
}
