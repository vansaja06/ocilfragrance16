import AuthService from "../services/AuthService.js";
import ApiError from "../utils/ApiError.js";
import config from "../config/index.js";

export default class AuthController {
  #authService;

  constructor(authService = new AuthService()) {
    this.#authService = authService;
  }

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const { token } = await this.#authService.login({ email, password });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: config.cookieMaxAge,
        path: "/",
      });

      res.json({ message: "Login berhasil" });
    } catch (error) {
      next(error);
    }
  };

  register = async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      const admin = await this.#authService.register({ name, email, password });

      res.status(201).json({
        success: true,
        message: "Register berhasil",
        admin,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        next(error);
        return;
      }

      next(
        ApiError.internal("Internal Server Error", {
          includeSuccess: true,
        })
      );
    }
  };

  logout = (req, res) => {
    res.clearCookie("token", { path: "/" });
    res.json({ success: true, message: "Logout berhasil" });
  };
}
