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

  checkStatus = async (req, res, next) => {
    try {
      const email = req.query.email;

      const result = await this.#subscriberService.checkStatus(email);

      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  approve = async (req, res, next) => {
    try {
      const subscriber = await this.#subscriberService.approve(req.params.id);

      res.json({ success: true, subscriber });
    } catch (error) {
      next(error);
    }
  };

  reject = async (req, res, next) => {
    try {
      const subscriber = await this.#subscriberService.reject(req.params.id);

      res.json({ success: true, subscriber });
    } catch (error) {
      next(error);
    }
  };

  cancel = async (req, res, next) => {
    try {
      const subscriber = await this.#subscriberService.cancel(req.body?.email);

      res.json({ success: true, subscriber });
    } catch (error) {
      next(error);
    }
  };
}
