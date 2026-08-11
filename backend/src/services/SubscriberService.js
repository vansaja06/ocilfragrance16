import SubscriberRepository from "../repositories/SubscriberRepository.js";
import ApiError from "../utils/ApiError.js";

export default class SubscriberService {
  #subscriberRepository;

  constructor(subscriberRepository = new SubscriberRepository()) {
    this.#subscriberRepository = subscriberRepository;
  }

  async list() {
    return this.#subscriberRepository.findAll();
  }

  async subscribe({ email, source }) {
    if (!email) {
      throw ApiError.badRequest("Email wajib diisi", {
        includeSuccess: true,
      });
    }

    const normalized = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      throw ApiError.badRequest("Format email tidak valid", {
        includeSuccess: true,
      });
    }

    const existing = await this.#subscriberRepository.findOne({
      email: normalized,
    });

    if (existing) {
      return existing;
    }

    return this.#subscriberRepository.create({
      email: normalized,
      source: source || "home",
    });
  }
}
