// Mengimpor library jsonwebtoken dan konfigurasi
import jwt from "jsonwebtoken";
import config from "../config/index.js";

// Fungsi untuk membuat (sign) token JWT dengan payload dan masa berlaku dari config
export function signToken(payload) {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
}

// Fungsi untuk memverifikasi token JWT, mengembalikan payload jika valid
export function verifyToken(token) {
  return jwt.verify(token, config.jwtSecret);
}
