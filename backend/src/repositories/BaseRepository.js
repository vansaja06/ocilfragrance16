export default class BaseRepository {
  #model;

  constructor(model) {
    this.#model = model;
  }

  findAll(filter = {}, options = {}) {
    return this.#model
      .find(filter)
      .sort(options.sort || { createdAt: -1 });
  }

  findById(id) {
    return this.#model.findById(id).exec();
  }

  findOne(filter) {
    return this.#model.findOne(filter).exec();
  }

  create(data) {
    return this.#model.create(data);
  }

  updateById(id, data) {
    return this.#model
      .findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .exec();
  }

  deleteById(id) {
    return this.#model.findByIdAndDelete(id).exec();
  }

  count(filter = {}) {
    return this.#model.countDocuments(filter).exec();
  }
}
