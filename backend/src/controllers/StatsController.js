import ProductService from "../services/ProductService.js";
import OrderService from "../services/OrderService.js";
import CustomerService from "../services/CustomerService.js";
import CategoryService from "../services/CategoryService.js";

export default class StatsController {
  #productService;

  #orderService;

  #customerService;

  #categoryService;

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

  summary = async (req, res, next) => {
    try {
      const [products, orders, customers, categories, recentOrders, topProducts, revenue] =
        await Promise.all([
          this.#productService.list(),
          this.#orderService.list(),
          this.#customerService.list(),
          this.#categoryService.list(),
          this.#orderService.recent(5),
          this.#productService.topSold(5),
          this.#orderService.revenue(),
        ]);

      res.json({
        success: true,
        stats: {
          revenue,
          totalOrders: orders.length,
          totalProducts: products.length,
          totalCustomers: customers.length,
          totalCategories: categories.length,
        },
        recentOrders,
        topProducts,
      });
    } catch (error) {
      next(error);
    }
  };
}
