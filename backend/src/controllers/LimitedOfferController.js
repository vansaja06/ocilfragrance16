// Mengimpor service LimitedOffer untuk operasi data
import LimitedOfferService from "../services/LimitedOfferService.js";

// Controller untuk menangani data Penawaran Terbatas (Limited Offer)
export default class LimitedOfferController {
  // Service penawaran terbatas (private property)
  #limitedOfferService;

  // Constructor dengan dependency injection untuk LimitedOfferService
  constructor(limitedOfferService = new LimitedOfferService()) {
    this.#limitedOfferService = limitedOfferService;
  }

  // Handler untuk mengambil data penawaran terbatas saat ini
  get = async (req, res, next) => {
    try {
      const limitedOffer = await this.#limitedOfferService.get();
      res.json({ success: true, limitedOffer });
    } catch (error) {
      next(error);
    }
  };

  // Handler untuk mengupdate data penawaran terbatas
  update = async (req, res, next) => {
    try {
      const limitedOffer = await this.#limitedOfferService.update(req.body);
      res.json({ success: true, limitedOffer });
    } catch (error) {
      next(error);
    }
  };
}
