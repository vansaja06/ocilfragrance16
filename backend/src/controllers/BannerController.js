// Mengimpor service Banner untuk operasi data
import BannerService from "../services/BannerService.js";

// Controller untuk menangani CRUD data Banner
export default class BannerController {
  // Service banner (private property)
  #bannerService;

  // Constructor dengan dependency injection untuk BannerService
  constructor(bannerService = new BannerService()) {
    this.#bannerService = bannerService;
  }

  // Handler untuk mengambil semua banner
  list = async (req, res, next) => {
    try {
      const banners = await this.#bannerService.list();
      res.json({ success: true, banners });
    } catch (error) {
      next(error);
    }
  };

  // Handler untuk mengambil hanya banner yang aktif saja
  active = async (req, res, next) => {
    try {
      const banners = await this.#bannerService.active();
      res.json({ success: true, banners });
    } catch (error) {
      next(error);
    }
  };

  // Handler untuk membuat banner baru
  create = async (req, res, next) => {
    try {
      const banner = await this.#bannerService.create(req.body);
      res.status(201).json({ success: true, banner });
    } catch (error) {
      next(error);
    }
  };

  // Handler untuk mengupdate banner berdasarkan ID
  update = async (req, res, next) => {
    try {
      const banner = await this.#bannerService.update(
        req.params.id, // ID dari URL parameter
        req.body       // Data baru dari body request
      );
      res.json({ success: true, banner });
    } catch (error) {
      next(error);
    }
  };

  // Handler untuk menghapus banner berdasarkan ID
  remove = async (req, res, next) => {
    try {
      await this.#bannerService.remove(req.params.id);
      res.json({ success: true, message: "Banner dihapus" });
    } catch (error) {
      next(error);
    }
  };
}
