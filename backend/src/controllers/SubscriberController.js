// Mengimpor service Subscriber untuk operasi data
import SubscriberService from "../services/SubscriberService.js";

// Controller untuk menangani data Subscriber (langganan newsletter)
export default class SubscriberController {
  // Service subscriber (private property)
  #subscriberService;

  // Constructor dengan dependency injection untuk SubscriberService
  constructor(subscriberService = new SubscriberService()) {
    this.#subscriberService = subscriberService;
  }

  // Handler untuk mengambil semua subscriber
  list = async (req, res, next) => {
    try {
      const subscribers = await this.#subscriberService.list();
      res.json({ success: true, subscribers });
    } catch (error) {
      next(error);
    }
  };

  // Handler untuk mendaftar sebagai subscriber baru
  subscribe = async (req, res, next) => {
    try {
      const subscriber = await this.#subscriberService.subscribe(req.body);
      res.status(201).json({ success: true, subscriber });
    } catch (error) {
      next(error);
    }
  };

  // Handler untuk mengecek status langganan berdasarkan email (query param)
  checkStatus = async (req, res, next) => {
    try {
      const email = req.query.email;
      const result = await this.#subscriberService.checkStatus(email);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  // Handler untuk menyetujui subscriber (admin only)
  approve = async (req, res, next) => {
    try {
      const subscriber = await this.#subscriberService.approve(req.params.id);
      res.json({ success: true, subscriber });
    } catch (error) {
      next(error);
    }
  };

  // Handler untuk menolak subscriber (admin only)
  reject = async (req, res, next) => {
    try {
      const subscriber = await this.#subscriberService.reject(req.params.id);
      res.json({ success: true, subscriber });
    } catch (error) {
      next(error);
    }
  };

  // Handler untuk membatalkan langganan (berhenti berlangganan)
  cancel = async (req, res, next) => {
    try {
      const subscriber = await this.#subscriberService.cancel(req.body?.email);
      res.json({ success: true, subscriber });
    } catch (error) {
      next(error);
    }
  };
}
