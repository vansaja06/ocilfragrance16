import SettingService from "../services/SettingService.js";

export default class SettingController {
  #settingService;

  constructor(settingService = new SettingService()) {
    this.#settingService = settingService;
  }

  getAll = async (req, res, next) => {
    try {
      const settings = await this.#settingService.getAll();

      res.json({ success: true, settings });
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const settings = await this.#settingService.update(req.body);

      res.json({ success: true, settings });
    } catch (error) {
      next(error);
    }
  };
}
