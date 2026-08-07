import SettingRepository from "../repositories/SettingRepository.js";

const DEFAULT_SETTINGS = {
  storeName: "Ocil Fragrance",
  tagline: "The Essence of Elegance",
  email: "",
  phone: "",
  address: "",
  instagram: "",
  twitter: "",
  facebook: "",
  qrisImage: "",
  bankAccount: "",
};

export default class SettingService {
  #settingRepository;

  constructor(settingRepository = new SettingRepository()) {
    this.#settingRepository = settingRepository;
  }

  async getAll() {
    const [record] = await this.#settingRepository.findAll({ key: "general" });

    return record?.value || {};
  }

  async update(payload) {
    const value = { ...DEFAULT_SETTINGS, ...payload };

    await this.#settingRepository.upsert("general", value);

    return value;
  }
}
