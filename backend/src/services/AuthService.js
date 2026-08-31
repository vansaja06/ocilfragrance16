// Mengimpor repository, error handler, dan utility yang dibutuhkan
import AdminRepository from "../repositories/AdminRepository.js";
import ApiError from "../utils/ApiError.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { signToken } from "../utils/jwt.js";

// Service untuk logika bisnis autentikasi admin (login, register)
export default class AuthService {
  // Repository admin (private property)
  #adminRepository;

  // Constructor dengan dependency injection untuk AdminRepository
  constructor(adminRepository = new AdminRepository()) {
    this.#adminRepository = adminRepository;
  }

  // Logika login: mencari admin by email, membandingkan password, menghasilkan token JWT
  async login({ email, password }) {
    // Mencari admin berdasarkan email
    const admin = await this.#adminRepository.findByEmail(email);

    // Jika admin tidak ditemukan
    if (!admin) {
      throw ApiError.unauthorized("Email tidak ditemukan");
    }

    // Membandingkan password input dengan password yang sudah di-hash
    const isPasswordMatch = await comparePassword(password, admin.password);

    // Jika password salah
    if (!isPasswordMatch) {
      throw ApiError.unauthorized("Password salah");
    }

    // Membuat token JWT dengan payload: id, email, role
    const token = signToken({
      id: admin._id,
      email: admin.email,
      role: "admin",
    });

    return { admin, token };
  }

  // Logika register: validasi input, cek duplikat email, hash password, simpan admin baru
  async register({ name, email, password }) {
    // Validasi input (nama, email, password wajib diisi)
    this.#validateRegisterInput({ name, email, password });

    // Cek apakah email sudah digunakan
    const existingAdmin = await this.#adminRepository.findByEmail(email);

    if (existingAdmin) {
      throw ApiError.badRequest("Email sudah digunakan", {
        includeSuccess: true,
      });
    }

    // Hash password sebelum disimpan ke database
    const hashedPassword = await hashPassword(password);

    // Simpan admin baru ke database
    const admin = await this.#adminRepository.createAdmin({
      name,
      email,
      password: hashedPassword,
    });

    // Mengembalikan data admin tanpa password
    return {
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
    };
  }

  // Method private untuk validasi input register
  #validateRegisterInput({ name, email, password }) {
    if (!name || !email || !password) {
      throw ApiError.badRequest("Semua field wajib diisi", {
        includeSuccess: true,
      });
    }
  }
}
