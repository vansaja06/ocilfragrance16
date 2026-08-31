// Mengimpor service yang dibutuhkan untuk mengambil data statistik
import ProductService from "../services/ProductService.js";
import OrderService from "../services/OrderService.js";
import CustomerService from "../services/CustomerService.js";
import CategoryService from "../services/CategoryService.js";

// Controller untuk menangani data Statistik dashboard admin
export default class StatsController {
  // Service produk (private property)
  #productService;

  // Service pesanan (private property)
  #orderService;

  // Service pelanggan (private property)
  #customerService;

  // Service kategori (private property)
  #categoryService;

  // Constructor dengan dependency injection untuk semua service yang dibutuhkan
  constructor(
    productService = new ProductService(),
    orderService = new OrderService(),
    customerService = new CustomerService(),
    categoryService = new CategoryService()
  ) {
    this.#productService = productService;
    this.#orderService = orderService;
    this.#customerService = customerService;
    this.#categoryService = categoryService;
  }

  // Handler untuk mengambil ringkasan statistik dashboard
  summary = async (req, res, next) => {
    try {
      // Mengambil semua data secara paralel menggunakan Promise.all (lebih cepat)
      const [products, orders, customers, categories, recentOrders, topProducts, revenue] =
        await Promise.all([
          this.#productService.list(),        // Semua produk
          this.#orderService.list(),          // Semua pesanan
          this.#customerService.list(),       // Semua pelanggan
          this.#categoryService.list(),       // Semua kategori
          this.#orderService.recent(5),       // 5 pesanan terbaru
          this.#productService.topSold(5),    // 5 produk terlaris
          this.#orderService.revenue(),       // Total pendapatan
        ]);

      // Mengirim data statistik ke client
      res.json({
        success: true,
        stats: {
          revenue,                            // Total pendapatan
          totalOrders: orders.length,         // Jumlah total pesanan
          totalProducts: products.length,     // Jumlah total produk
          totalCustomers: customers.length,   // Jumlah total pelanggan
          totalCategories: categories.length, // Jumlah total kategori
        },
        recentOrders,  // 5 pesanan terbaru
        topProducts,   // 5 produk terlaris
      });
    } catch (error) {
      next(error);
    }
  };
}
