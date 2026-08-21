import OrderRepository from "../repositories/OrderRepository.js";
import ProductRepository from "../repositories/ProductRepository.js";
import CustomerRepository from "../repositories/CustomerRepository.js";
import ApiError from "../utils/ApiError.js";

const MONGO_ID_PATTERN = /^[0-9a-fA-F]{24}$/;

export default class OrderService {
  #orderRepository;
  #productRepository;
  #customerRepository;

  constructor(
    orderRepository = new OrderRepository(),
    productRepository = new ProductRepository(),
    customerRepository = new CustomerRepository()
  ) {
    this.#orderRepository = orderRepository;
    this.#productRepository = productRepository;
    this.#customerRepository = customerRepository;
  }

  async list({ limit } = {}) {
    const parsed = limit ? parseInt(limit, 10) : null;

    if (parsed && parsed > 0) {
      return this.#orderRepository.findRecent(Math.min(parsed, 50));
    }

    return this.#orderRepository.findWithDetails();
  }

  async create(data) {
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

    if (!customerName || !phone || !address) {
      throw ApiError.badRequest("Nama, telepon, dan alamat wajib diisi", {
        includeSuccess: true,
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw ApiError.badRequest("Produk wajib dipilih", {
        includeSuccess: true,
      });
    }

    for (const item of items) {
      if (!item?.name || !item?.price || !item?.qty) {
        throw ApiError.badRequest("Data produk tidak lengkap", {
          includeSuccess: true,
        });
      }
    }

    const total = items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    const order = await this.#orderRepository.create({
      invoice: await this.#generateInvoice(),
      customerName,
      customerEmail: customerEmail || "",
      phone,
      address,
      items,
      total,
      payment: payment || "",
      paymentProof: paymentProof || "",
      shipping: shipping || "",
      status: "Menunggu",
    });

    await this.#increaseSales(items);
    await this.#upsertCustomer({
      customerName,
      customerEmail: customerEmail || "",
      phone,
      address,
    });

    return order;
  }

  async recent(limit = 5) {
    return this.#orderRepository.findRecent(limit);
  }

  async getById(id) {
    const order = await this.#orderRepository.findById(id);

    if (!order) {
      throw ApiError.notFound("Pesanan tidak ditemukan");
    }

    return order;
  }

  async updateStatus(id, { status }) {
    if (!status) {
      throw ApiError.badRequest("Status wajib diisi", {
        includeSuccess: true,
      });
    }

    await this.getById(id);

    return this.#orderRepository.updateById(id, { status });
  }

  async revenue() {
    const [result] = await this.#orderRepository.sumTotal();

    return result?.revenue || 0;
  }

  async #generateInvoice() {
    const count = await this.#orderRepository.count();

    const now = new Date();

    const ymd = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("");

    return `INV-${ymd}-${String(count + 1).padStart(5, "0")}`;
  }

  async #increaseSales(items) {
    for (const item of items) {
      const productId = item.product;

      if (!productId || !MONGO_ID_PATTERN.test(productId)) continue;

      const product = await this.#productRepository.findById(productId);

      if (!product) continue;

      await this.#productRepository.updateById(productId, {
        sold: (product.sold || 0) + item.qty,
        stock: Math.max(0, (product.stock || 0) - item.qty),
      });
    }
  }

  async #upsertCustomer({ customerName, customerEmail, phone, address }) {
    const email = (customerEmail || "").trim().toLowerCase();
    const name = (customerName || "").trim();
    const phoneValue = (phone || "").trim();
    const addressValue = (address || "").trim();

    let existing = null;

    if (email) {
      existing = await this.#customerRepository.findByEmail(email);
    }

    if (!existing && phoneValue) {
      existing = await this.#customerRepository.findOne({
        phone: phoneValue,
      });
    }

    if (existing) {
      return this.#customerRepository.updateById(existing._id, {
        name: name || existing.name,
        email: email || existing.email,
        phone: phoneValue || existing.phone,
        address: addressValue || existing.address,
      });
    }

    return this.#customerRepository.create({
      name,
      email,
      phone: phoneValue,
      address: addressValue,
    });
  }
}
