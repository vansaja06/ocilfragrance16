// Mengimpor service Setting untuk operasi data
import SettingService from "../services/SettingService.js";

// Controller untuk menangani Pengaturan toko
export default class SettingController {
  // Service pengaturan (private property)
  #settingService;

  // Constructor dengan dependency injection untuk SettingService
  constructor(settingService = new SettingService()) {
    this.#settingService = settingService;
  }

  // Handler untuk mengambil semua pengaturan toko
  getAll = async (req, res, next) => {
    try {
      const settings = await this.#settingService.getAll();
      res.json({ success: true, settings });
    } catch (error) {
      next(error);
    }
  };

  // Handler untuk mengupdate pengaturan toko (merge dengan default settings)
  update = async (req, res, next) => {
    try {
      const settings = await this.#settingService.update(req.body);
      res.json({ success: true, settings });
    } catch (error) {
      next(error);
    }
  };
}
