// Mengimpor mongoose untuk membuat schema dan model
import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

// Schema untuk item dalam pesanan (sub-schema, tidak punya _id sendiri)
const OrderItemSchema = new Schema(
  {
    // Referensi ke produk yang dipesan
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },

    // Nama produk saat dipesan (diambil snapshot, tidak berubah jika produk diupdate)
    name: {
      type: String,
      required: true,
    },

    // Jumlah/item yang dipesan
    qty: {
      type: Number,
      required: true,
      default: 1,
    },

    // Harga satuan saat dipesan (diambil snapshot)
    price: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    // Item tidak perlu _id karena merupakan sub-dokumen
    _id: false,
  }
);

// Schema utama untuk data Pesanan (Order)
const OrderSchema = new Schema(
  {
    // Nomor invoice unik (contoh: INV-20260901-00001)
    invoice: {
      type: String,
      required: true,
      unique: true,
    },

    // Nama pemesan
    customerName: {
      type: String,
      required: true,
    },

    // Email pemesan (opsional)
    customerEmail: {
      type: String,
      default: "",
    },

    // Nomor telepon pemesan
    phone: {
      type: String,
      default: "",
    },

    // Alamat pengiriman
    address: {
      type: String,
      default: "",
    },

    // Daftar item yang dipesan (array dari OrderItemSchema)
    items: {
      type: [OrderItemSchema],
      default: [],
    },

    // Total harga seluruh pesanan
    total: {
      type: Number,
      required: true,
      default: 0,
    },

    // Metode pembayaran yang dipilih
    payment: {
      type: String,
      default: "",
    },

    // URL/bukti pembayaran yang diupload
    paymentProof: {
      type: String,
      default: "",
    },

    // Metode pengiriman yang dipilih
    shipping: {
      type: String,
      default: "",
    },

    // Status pesanan (hanya boleh salah satu dari opsi berikut)
    status: {
      type: String,
      enum: ["Menunggu", "Diproses", "Selesai", "Dibatalkan"],
      default: "Menunggu",
    },
  },
  {
    // Otomatis menambahkan field createdAt dan updatedAt
    timestamps: true,
  }
);

// Mengekspor model, menggunakan model yang sudah ada jika sudah terdaftar
export default models.Order || model("Order", OrderSchema);
