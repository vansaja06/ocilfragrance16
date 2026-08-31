// Mengimpor service, error handler, dan config yang dibutuhkan
import AuthService from "../services/AuthService.js";
import ApiError from "../utils/ApiError.js";
import config from "../config/index.js";

// Controller untuk menangani autentikasi admin (login, register, logout)
export default class AuthController {
  // Service autentikasi (private property)
  #authService;

  // Constructor dengan dependency injection untuk AuthService
  constructor(authService = new AuthService()) {
    this.#authService = authService;
  }

  // Handler untuk login admin - menerima email & password, mengembalikan token di cookie
  login = async (req, res, next) => {
    try {
      // Mengambil email dan password dari body request
      const { email, password } = req.body;

      // Memanggil service login, mendapatkan token
      const { token } = await this.#authService.login({ email, password });

      // Menyimpan token ke cookie httpOnly (aman dari XSS)
      res.cookie("token", token, {
        httpOnly: true, // Cookie tidak bisa diakses oleh JavaScript di browser
        secure: process.env.NODE_ENV === "production", // HTTPS only di production
        sameSite: "lax", // Proteksi CSRF
        maxAge: config.cookieMaxAge, // Masa berlaku cookie (7 hari)
        path: "/",
      });

      // Mengirim response sukses
      res.json({ message: "Login berhasil" });
    } catch (error) {
      // Meneruskan error ke middleware penanganan error
      next(error);
    }
  };

  // Handler untuk register admin baru
  register = async (req, res, next) => {
    try {
      // Mengambil data dari body request
      const { name, email, password } = req.body;

      // Memanggil service register, membuat admin baru
      const admin = await this.#authService.register({ name, email, password });

      // Mengirim response sukses dengan status 201 (Created)
      res.status(201).json({
        success: true,
        message: "Register berhasil",
        admin,
      });
    } catch (error) {
      // Jika error adalah ApiError, kirim langsung
      if (error instanceof ApiError) {
        next(error);
        return;
      }

      // Jika error tak dikenal, kirim error 500 Internal Server Error
      next(
        ApiError.internal("Internal Server Error", {
          includeSuccess: true,
        })
      );
    }
  };

  // Handler untuk logout - menghapus cookie token
  logout = (req, res) => {
    // Menghapus cookie "token" dari browser
    res.clearCookie("token", { path: "/" });
    res.json({ success: true, message: "Logout berhasil" });
  };
}
