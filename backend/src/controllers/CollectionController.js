import CollectionService from "../services/CollectionService.js";

export default class CollectionController {
  #collectionService;

  constructor(collectionService = new CollectionService()) {
    this.#collectionService = collectionService;
  }

  get = async (req, res, next) => {
    try {
      const collection = await this.#collectionService.get();

      res.json({ success: true, collection });
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const collection = await this.#collectionService.update(req.body);

      res.json({ success: true, collection });
    } catch (error) {
      next(error);
    }
  };
}
