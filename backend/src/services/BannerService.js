import BannerRepository from "../repositories/BannerRepository.js";
import ApiError from "../utils/ApiError.js";

export default class BannerService {
  #bannerRepository;

  constructor(bannerRepository = new BannerRepository()) {
    this.#bannerRepository = bannerRepository;
  }

  async list() {
    return this.#bannerRepository.findAll();
  }

  async active() {
    return this.#bannerRepository.findActive();
  }

  async getById(id) {
    const banner = await this.#bannerRepository.findById(id);

    if (!banner) {
      throw ApiError.notFound("Banner tidak ditemukan");
    }

    return banner;
  }

  async create(data) {
    if (!data.title) {
      throw ApiError.badRequest("Judul banner wajib diisi", {
        includeSuccess: true,
      });
    }

    return this.#bannerRepository.create(data);
  }

  async update(id, data) {
    await this.getById(id);

    return this.#bannerRepository.updateById(id, data);
  }

  async remove(id) {
    await this.getById(id);

    return this.#bannerRepository.deleteById(id);
  }
}
