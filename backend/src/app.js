// Mengimpor modul yang dibutuhkan untuk membuat aplikasi Express
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config/index.js";
import routes from "./routes/index.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";

// Membuat instance aplikasi Express
const app = express();

// Middleware CORS - mengizinkan request dari frontend (client) dengan credentials (cookie)
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
);

// Middleware untuk parse body request berformat JSON
app.use(express.json());
// Middleware untuk parse body request dari form (URL encoded)
app.use(express.urlencoded({ extended: true }));
// Middleware untuk membaca cookie dari request
app.use(cookieParser());

// Menggabungkan semua route di bawah prefix /api
app.use("/api", routes);

// Middleware untuk menangani route yang tidak ditemukan (404)
app.use(notFound);
// Middleware penanganan error global
app.use(errorHandler);

// Mengekspor instance aplikasi agar bisa digunakan di file lain (server.js)
export default app;
