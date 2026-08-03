import Admin from "../models/Admin.js";

export default class AdminRepository {
  #model = Admin;

  findByEmail(email) {
    return this.#model.findOne({ email }).exec();
  }

  createAdmin(data) {
    return this.#model.create(data);
  }
}
