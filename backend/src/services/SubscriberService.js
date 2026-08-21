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

  async getById(id) {
    const subscriber = await this.#subscriberRepository.findById(id);

    if (!subscriber) {
      throw ApiError.notFound("Subscriber tidak ditemukan");
    }

    return subscriber;
  }

  async checkStatus(email) {
    if (!email) return { subscribed: false };

    const normalized = email.trim().toLowerCase();

    const subscriber = await this.#subscriberRepository.findByEmail(normalized);

    if (!subscriber) return { subscribed: false };

    const now = new Date();

    if (
      subscriber.status === "Disetujui" &&
      (!subscriber.expiresAt || subscriber.expiresAt > now)
    ) {
      return { subscribed: true, subscriber };
    }

    return { subscribed: false, subscriber };
  }

  async subscribe({ email, name, phone, payment, paymentProof, source }) {
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
      if (existing.status === "Menunggu") {
        throw ApiError.badRequest("Email sudah terdaftar, menunggu persetujuan", {
          includeSuccess: true,
        });
      }

      if (existing.status === "Disetujui") {
        return existing;
      }

      if (existing.status === "Ditolak") {
        if (!paymentProof) {
          throw ApiError.badRequest("Upload bukti pembayaran terlebih dahulu", {
            includeSuccess: true,
          });
        }

        return this.#subscriberRepository.updateById(existing._id, {
          name: name || existing.name,
          phone: phone || existing.phone,
          payment: payment || existing.payment,
          paymentProof,
          status: "Menunggu",
        });
      }
    }

    if (!paymentProof) {
      throw ApiError.badRequest("Upload bukti pembayaran terlebih dahulu", {
        includeSuccess: true,
      });
    }

    return this.#subscriberRepository.create({
      email: normalized,
      name: name || "",
      phone: phone || "",
      payment: payment || "",
      paymentProof,
      status: "Menunggu",
      source: source || "home",
    });
  }

  async approve(id) {
    const subscriber = await this.#subscriberRepository.findById(id);

    if (!subscriber) {
      throw ApiError.notFound("Subscriber tidak ditemukan");
    }

    const expiresAt = new Date();

    expiresAt.setMonth(expiresAt.getMonth() + 1);

    return this.#subscriberRepository.updateById(id, {
      status: "Disetujui",
      expiresAt,
    });
  }

  async reject(id) {
    const subscriber = await this.#subscriberRepository.findById(id);

    if (!subscriber) {
      throw ApiError.notFound("Subscriber tidak ditemukan");
    }

    return this.#subscriberRepository.updateById(id, {
      status: "Ditolak",
    });
  }

  async cancel(email) {
    if (!email) {
      throw ApiError.badRequest("Email wajib diisi", {
        includeSuccess: true,
      });
    }

    const normalized = email.trim().toLowerCase();

    const subscriber = await this.#subscriberRepository.findByEmail(normalized);

    if (!subscriber) {
      throw ApiError.notFound("Langganan tidak ditemukan");
    }

    if (subscriber.status !== "Disetujui") {
      throw ApiError.badRequest("Tidak ada langganan aktif untuk email ini", {
        includeSuccess: true,
      });
    }

    return this.#subscriberRepository.updateById(subscriber._id, {
      status: "Berhenti",
      expiresAt: null,
    });
  }
}
