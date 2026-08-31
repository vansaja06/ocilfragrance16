// Mengimpor library bcryptjs untuk enkripsi password
import bcrypt from "bcryptjs";

// Fungsi untuk meng-hash password menggunakan 10 salt rounds
export function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

// Fungsi untuk membandingkan password input dengan password yang sudah di-hash
export function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}
