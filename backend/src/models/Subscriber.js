// Mengimpor mongoose untuk membuat schema dan model
import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

// Schema untuk data Subscriber (pengguna yang berlangganan newsletter/layanan)
const SubscriberSchema = new Schema(
  {
    // Email subscriber (unique, otomatis lowercase dan trim spasi)
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Nama subscriber (opsional)
    name: {
      type: String,
      default: "",
    },

    // Nomor telepon subscriber (opsional)
    phone: {
      type: String,
      default: "",
    },

    // Metode pembayaran langganan
    payment: {
      type: String,
      default: "",
    },

    // URL/bukti pembayaran langganan
    paymentProof: {
      type: String,
      default: "",
    },

    // Status langganan (Menunggu review, Disetujui, Ditolak, atau Berhenti)
    status: {
      type: String,
      enum: ["Menunggu", "Disetujui", "Ditolak", "Berhenti"],
      default: "Menunggu",
    },

    // Tanggal kadaluarsa langganan (1 bulan setelah disetujui)
    expiresAt: {
      type: Date,
      default: null,
    },

    // Sumber subscriber berasal dari mana (contoh: "home" untuk halaman utama)
    source: {
      type: String,
      default: "home",
    },
  },
  {
    // Otomatis menambahkan field createdAt dan updatedAt
    timestamps: true,
  }
);

// Mengekspor model, menggunakan model yang sudah ada jika sudah terdaftar
export default models.Subscriber || model("Subscriber", SubscriberSchema);
