// Mengimpor repository dan error handler yang dibutuhkan
import OrderRepository from "../repositories/OrderRepository.js";
import ProductRepository from "../repositories/ProductRepository.js";
import CustomerRepository from "../repositories/CustomerRepository.js";
import ApiError from "../utils/ApiError.js";

// Pola regex untuk validasi MongoDB ObjectId (24 karakter hex)
const MONGO_ID_PATTERN = /^[0-9a-fA-F]{24}$/;

// Service untuk logika bisnis data Pesanan/Order
export default class OrderService {
  // Repository yang dibutuhkan (private properties)
  #orderRepository;
  #productRepository;
  #customerRepository;

  // Constructor dengan dependency injection
  constructor(
    orderRepository = new OrderRepository(),
    productRepository = new ProductRepository(),
    customerRepository = new CustomerRepository()
  ) {
    this.#orderRepository = orderRepository;
    this.#productRepository = productRepository;
    this.#customerRepository = customerRepository;
  }

  // Mengambil daftar pesanan, mendukung query ?limit= untuk batas jumlah (maks 50)
  async list({ limit } = {}) {
    const parsed = limit ? parseInt(limit, 10) : null;

    // Jika ada parameter limit, ambil pesanan terbaru sesuai batas
    if (parsed && parsed > 0) {
      return this.#orderRepository.findRecent(Math.min(parsed, 50));
    }

    // Jika tidak ada limit, ambil semua dengan detail item produk
    return this.#orderRepository.findWithDetails();
  }

  // Membuat pesanan baru (logika utama)
  async create(data) {
    // Destructuring data dari body request
    const {
      customerName,
      customerEmail,
      phone,
      address,
      payment,
      paymentProof,
      shipping,
      items,
    } = data || {};

    // Validasi field wajib: nama, telepon, alamat
    if (!customerName || !phone || !address) {
      throw ApiError.badRequest("Nama, telepon, dan alamat wajib diisi", {
        includeSuccess: true,
      });
    }

    // Validasi minimal ada 1 item yang dipesan
    if (!Array.isArray(items) || items.length === 0) {
      throw ApiError.badRequest("Produk wajib dipilih", {
        includeSuccess: true,
      });
    }

    // Validasi setiap item harus memiliki nama, harga, dan jumlah
    for (const item of items) {
      if (!item?.name || !item?.price || !item?.qty) {
        throw ApiError.badRequest("Data produk tidak lengkap", {
          includeSuccess: true,
        });
      }
    }

    // Validasi stok produk cukup untuk jumlah yang dipesan
    await this.#validateStock(items);

    // Menghitung total harga dari semua item
    const total = items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    // Membuat pesanan di database dengan invoice otomatis
    const order = await this.#orderRepository.create({
      invoice: await this.#generateInvoice(), // Nomor invoice unik
      customerName,
      customerEmail: customerEmail || "",
      phone,
      address,
      items,
      total,
      payment: payment || "",
      paymentProof: paymentProof || "",
      shipping: shipping || "",
      status: "Menunggu", // Status default: menunggu konfirmasi
    });

    // Update jumlah terjual dan stok produk
    await this.#increaseSales(items);
    // Simpan atau update data pelanggan
    await this.#upsertCustomer({
      customerName,
      customerEmail: customerEmail || "",
      phone,
      address,
    });

    return order;
  }

  // Mengambil pesanan terbaru
  async recent(limit = 5) {
    return this.#orderRepository.findRecent(limit);
  }

  // Mengambil detail pesanan berdasarkan ID
  async getById(id) {
    const order = await this.#orderRepository.findById(id);

    if (!order) {
      throw ApiError.notFound("Pesanan tidak ditemukan");
    }

    return order;
  }

  // Mengupdate status pesanan (Menunggu/Diproses/Selesai/Dibatalkan)
  async updateStatus(id, { status }) {
    if (!status) {
      throw ApiError.badRequest("Status wajib diisi", {
        includeSuccess: true,
      });
    }

    // Pastikan pesanan ada
    await this.getById(id);

    return this.#orderRepository.updateById(id, { status });
  }

  // Menghitung total pendapatan dari seluruh pesanan
  async revenue() {
    const [result] = await this.#orderRepository.sumTotal();
    return result?.revenue || 0;
  }

  // Method private: membuat nomor invoice unik (format: INV-YYYYMMDD-00001)
  async #generateInvoice() {
    // Menghitung jumlah pesanan yang ada untuk nomor urut
    const count = await this.#orderRepository.count();

    const now = new Date();

    // Format tanggal: YYYYMMDD
    const ymd = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("");

    // Format: INV-YYYYMMDD-00001 (5 digit nomor urut)
    return `INV-${ymd}-${String(count + 1).padStart(5, "0")}`;
  }

  // Method private: memvalidasi stok setiap item yang dipesan
  async #validateStock(items) {
    for (const item of items) {
      const productId = item.product;

      // Skip jika tidak ada product ID atau bukan ObjectId valid
      if (!productId || !MONGO_ID_PATTERN.test(productId)) continue;

      const product = await this.#productRepository.findById(productId);

      if (!product) continue;

      const available = product.stock || 0;
      const requested = item.qty || 0;

      // Cek apakah stok habis
      if (available <= 0) {
        throw ApiError.badRequest(
          `Maaf, produk ${product.name} sedang habis dan tidak dapat dipesan`,
          { includeSuccess: true }
        );
      }

      // Cek apakah stok mencukupi
      if (requested > available) {
        throw ApiError.badRequest(
          `Stok ${product.name} hanya tersisa ${available}`,
          { includeSuccess: true }
        );
      }
    }
  }

  // Method private: menambah jumlah terjual dan mengurangi stok produk
  async #increaseSales(items) {
    for (const item of items) {
      const productId = item.product;

      // Skip jika tidak ada product ID atau bukan ObjectId valid
      if (!productId || !MONGO_ID_PATTERN.test(productId)) continue;

      const product = await this.#productRepository.findById(productId);

      if (!product) continue;

      // Update jumlah terjual (+qty) dan stok (-qty, minimal 0)
      await this.#productRepository.updateById(productId, {
        sold: (product.sold || 0) + item.qty,
        stock: Math.max(0, (product.stock || 0) - item.qty),
      });
    }
  }

  // Method private: upsert pelanggan (update jika sudah ada, buat baru jika belum)
  // Mencari berdasarkan email atau nomor telepon
  async #upsertCustomer({ customerName, customerEmail, phone, address }) {
    const email = (customerEmail || "").trim().toLowerCase();
    const name = (customerName || "").trim();
    const phoneValue = (phone || "").trim();
    const addressValue = (address || "").trim();

    let existing = null;

    // Cari pelanggan berdasarkan email terlebih dahulu
    if (email) {
      existing = await this.#customerRepository.findByEmail(email);
    }

    // Jika tidak ditemukan, coba cari berdasarkan nomor telepon
    if (!existing && phoneValue) {
      existing = await this.#customerRepository.findOne({
        phone: phoneValue,
      });
    }

    // Jika pelanggan sudah ada, update datanya
    if (existing) {
      return this.#customerRepository.updateById(existing._id, {
        name: name || existing.name,
        email: email || existing.email,
        phone: phoneValue || existing.phone,
        address: addressValue || existing.address,
      });
    }

    // Jika belum ada, buat pelanggan baru
    return this.#customerRepository.create({
      name,
      email,
      phone: phoneValue,
      address: addressValue,
    });
  }
}
