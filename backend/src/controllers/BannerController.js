import BannerService from "../services/BannerService.js";

export default class BannerController {
  #bannerService;

  constructor(bannerService = new BannerService()) {
    this.#bannerService = bannerService;
  }

  list = async (req, res, next) => {
    try {
      const banners = await this.#bannerService.list();

      res.json({ success: true, banners });
    } catch (error) {
      next(error);
    }
  };

  active = async (req, res, next) => {
    try {
      const banners = await this.#bannerService.active();

      res.json({ success: true, banners });
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const banner = await this.#bannerService.create(req.body);

      res.status(201).json({ success: true, banner });
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const banner = await this.#bannerService.update(
        req.params.id,
        req.body
      );

      res.json({ success: true, banner });
    } catch (error) {
      next(error);
    }
  };

  remove = async (req, res, next) => {
    try {
      await this.#bannerService.remove(req.params.id);

      res.json({ success: true, message: "Banner dihapus" });
    } catch (error) {
      next(error);
    }
  };
}
