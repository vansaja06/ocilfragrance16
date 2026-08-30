import LimitedOfferService from "../services/LimitedOfferService.js";

export default class LimitedOfferController {
  #limitedOfferService;

  constructor(limitedOfferService = new LimitedOfferService()) {
    this.#limitedOfferService = limitedOfferService;
  }

  get = async (req, res, next) => {
    try {
      const limitedOffer = await this.#limitedOfferService.get();

      res.json({ success: true, limitedOffer });
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const limitedOffer = await this.#limitedOfferService.update(req.body);

      res.json({ success: true, limitedOffer });
    } catch (error) {
      next(error);
    }
  };
}
