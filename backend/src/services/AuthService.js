import AdminRepository from "../repositories/AdminRepository.js";
import ApiError from "../utils/ApiError.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { signToken } from "../utils/jwt.js";

export default class AuthService {
  #adminRepository;

  constructor(adminRepository = new AdminRepository()) {
    this.#adminRepository = adminRepository;
  }

  async login({ email, password }) {
    const admin = await this.#adminRepository.findByEmail(email);

    if (!admin) {
      throw ApiError.unauthorized("Email tidak ditemukan");
    }

    const isPasswordMatch = await comparePassword(password, admin.password);

    if (!isPasswordMatch) {
      throw ApiError.unauthorized("Password salah");
    }

    const token = signToken({
      id: admin._id,
      email: admin.email,
      role: "admin",
    });

    return { admin, token };
  }

  async register({ name, email, password }) {
    this.#validateRegisterInput({ name, email, password });

    const existingAdmin = await this.#adminRepository.findByEmail(email);

    if (existingAdmin) {
      throw ApiError.badRequest("Email sudah digunakan", {
        includeSuccess: true,
      });
    }

    const hashedPassword = await hashPassword(password);

    const admin = await this.#adminRepository.createAdmin({
      name,
      email,
      password: hashedPassword,
    });

    return {
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
    };
  }

  #validateRegisterInput({ name, email, password }) {
    if (!name || !email || !password) {
      throw ApiError.badRequest("Semua field wajib diisi", {
        includeSuccess: true,
      });
    }
  }
}
