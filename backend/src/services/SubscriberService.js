// Mengimpor repository dan error handler yang dibutuhkan
import SubscriberRepository from "../repositories/SubscriberRepository.js";
import ApiError from "../utils/ApiError.js";

// Service untuk logika bisnis data Subscriber (langganan newsletter)
export default class SubscriberService {
  // Repository subscriber (private property)
  #subscriberRepository;

  // Constructor dengan dependency injection
  constructor(subscriberRepository = new SubscriberRepository()) {
    this.#subscriberRepository = subscriberRepository;
  }

  // Mengambil semua subscriber
  async list() {
    return this.#subscriberRepository.findAll();
  }

  // Mengambil subscriber berdasarkan ID
  async getById(id) {
    const subscriber = await this.#subscriberRepository.findById(id);

    if (!subscriber) {
      throw ApiError.notFound("Subscriber tidak ditemukan");
    }

    return subscriber;
  }

  // Mengecek status langganan berdasarkan email
  async checkStatus(email) {
    // Jika email tidak ada, kembalikan tidak berlangganan
    if (!email) return { subscribed: false };

    const normalized = email.trim().toLowerCase();

    // Cari subscriber berdasarkan email
    const subscriber = await this.#subscriberRepository.findByEmail(normalized);

    // Jika tidak ditemukan
    if (!subscriber) return { subscribed: false };

    const now = new Date();

    // Cek apakah langganan aktif: status "Disetujui" dan belum kadaluarsa
    if (
      subscriber.status === "Disetujui" &&
      (!subscriber.expiresAt || subscriber.expiresAt > now)
    ) {
      return { subscribed: true, subscriber };
    }

    return { subscribed: false, subscriber };
  }

  // Mendaftar sebagai subscriber baru atau memperbarui yang sudah ada
  async subscribe({ email, name, phone, payment, paymentProof, source }) {
    // Validasi email wajib diisi
    if (!email) {
      throw ApiError.badRequest("Email wajib diisi", {
        includeSuccess: true,
      });
    }

    const normalized = email.trim().toLowerCase();

    // Validasi format email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      throw ApiError.badRequest("Format email tidak valid", {
        includeSuccess: true,
      });
    }

    // Cek apakah email sudah terdaftar
    const existing = await this.#subscriberRepository.findOne({
      email: normalized,
    });

    if (existing) {
      // Jika status "Menunggu", tidak perlu mendaftar ulang
      if (existing.status === "Menunggu") {
        throw ApiError.badRequest("Email sudah terdaftar, menunggu persetujuan", {
          includeSuccess: true,
        });
      }

      // Jika sudah "Disetujui", langsung kembalikan data yang ada
      if (existing.status === "Disetujui") {
        return existing;
      }

      // Jika "Ditolak", izinkan mendaftar ulang dengan bukti pembayaran baru
      if (existing.status === "Ditolak") {
        if (!paymentProof) {
          throw ApiError.badRequest("Upload bukti pembayaran terlebih dahulu", {
            includeSuccess: true,
          });
        }

        // Update status menjadi "Menunggu" untuk review ulang
        return this.#subscriberRepository.updateById(existing._id, {
          name: name || existing.name,
          phone: phone || existing.phone,
          payment: payment || existing.payment,
          paymentProof,
          status: "Menunggu",
        });
      }
    }

    // Subscriber baru: wajib upload bukti pembayaran
    if (!paymentProof) {
      throw ApiError.badRequest("Upload bukti pembayaran terlebih dahulu", {
        includeSuccess: true,
      });
    }

    // Simpan subscriber baru dengan status "Menunggu"
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

  // Menyetujui subscriber (admin only): mengatur masa berlaku 1 bulan
  async approve(id) {
    const subscriber = await this.#subscriberRepository.findById(id);

    if (!subscriber) {
      throw ApiError.notFound("Subscriber tidak ditemukan");
    }

    // Set tanggal kadaluarsa: 1 bulan dari sekarang
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    return this.#subscriberRepository.updateById(id, {
      status: "Disetujui",
      expiresAt,
    });
  }

  // Menolak subscriber (admin only)
  async reject(id) {
    const subscriber = await this.#subscriberRepository.findById(id);

    if (!subscriber) {
      throw ApiError.notFound("Subscriber tidak ditemukan");
    }

    return this.#subscriberRepository.updateById(id, {
      status: "Ditolak",
    });
  }

  // Membatalkan langganan (berhenti berlangganan)
  async cancel(email) {
    if (!email) {
      throw ApiError.badRequest("Email wajib diisi", {
        includeSuccess: true,
      });
    }

    const normalized = email.trim().toLowerCase();

    // Cari subscriber berdasarkan email
    const subscriber = await this.#subscriberRepository.findByEmail(normalized);

    if (!subscriber) {
      throw ApiError.notFound("Langganan tidak ditemukan");
    }

    // Hanya subscriber "Disetujui" yang bisa berhenti berlangganan
    if (subscriber.status !== "Disetujui") {
      throw ApiError.badRequest("Tidak ada langganan aktif untuk email ini", {
        includeSuccess: true,
      });
    }

    // Set status "Berhenti" dan hapus tanggal kadaluarsa
    return this.#subscriberRepository.updateById(subscriber._id, {
      status: "Berhenti",
      expiresAt: null,
    });
  }
}
