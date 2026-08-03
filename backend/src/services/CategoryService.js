import CategoryRepository from "../repositories/CategoryRepository.js";
import ApiError from "../utils/ApiError.js";

export default class CategoryService {
  #categoryRepository;

  constructor(categoryRepository = new CategoryRepository()) {
    this.#categoryRepository = categoryRepository;
  }

  async list() {
    return this.#categoryRepository.findAll();
  }

  async getById(id) {
    const category = await this.#categoryRepository.findById(id);

    if (!category) {
      throw ApiError.notFound("Kategori tidak ditemukan");
    }

    return category;
  }

  async create({ name, description }) {
    if (!name) {
      throw ApiError.badRequest("Nama kategori wajib diisi", {
        includeSuccess: true,
      });
    }

    const existing = await this.#categoryRepository.findBySlug(
      this.#slugify(name)
    );

    if (existing) {
      throw ApiError.badRequest("Kategori sudah ada", {
        includeSuccess: true,
      });
    }

    return this.#categoryRepository.create({
      name,
      slug: this.#slugify(name),
      description: description || "",
    });
  }

  async remove(id) {
    await this.getById(id);

    return this.#categoryRepository.deleteById(id);
  }

  #slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  }
}
