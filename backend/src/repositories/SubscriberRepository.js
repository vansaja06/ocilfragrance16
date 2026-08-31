// Mengimpor model Subscriber dan BaseRepository untuk operasi database
import Subscriber from "../models/Subscriber.js";
import BaseRepository from "./BaseRepository.js";

// Repository untuk data Subscriber (warisan dari BaseRepository)
export default class SubscriberRepository extends BaseRepository {
  // Menginisialisasi dengan model Subscriber
  constructor() {
    super(Subscriber);
  }

  // Mencari subscriber berdasarkan email
  findByEmail(email) {
    return this.findOne({ email });
  }

  // Mencari semua subscriber yang statusnya "Disetujui"
  findApproved() {
    return this.findAll({ status: "Disetujui" });
  }
}
