import SubscriberService from "../services/SubscriberService.js";

export default class SubscriberController {
  #subscriberService;

  constructor(subscriberService = new SubscriberService()) {
    this.#subscriberService = subscriberService;
  }

  list = async (req, res, next) => {
    try {
      const subscribers = await this.#subscriberService.list();

      res.json({ success: true, subscribers });
    } catch (error) {
      next(error);
    }
  };

  subscribe = async (req, res, next) => {
    try {
      const subscriber = await this.#subscriberService.subscribe(req.body);

      res.status(201).json({ success: true, subscriber });
    } catch (error) {
      next(error);
    }
  };
}
