import categoriesData from "@/services/mockData/categories.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const categoryService = {
  async getAll() {
    await delay(250);
    return [...categoriesData];
  },

  async getById(id) {
    await delay(200);
    const category = categoriesData.find(c => c.Id === id);
    if (!category) {
      throw new Error("Category not found");
    }
    return { ...category };
  },

  async create(category) {
    await delay(400);
    const maxId = Math.max(...categoriesData.map(c => c.Id), 0);
    const newCategory = {
      ...category,
      Id: maxId + 1,
      createdAt: new Date().toISOString()
    };
    categoriesData.push(newCategory);
    return { ...newCategory };
  },

  async update(id, updates) {
    await delay(300);
    const index = categoriesData.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Category not found");
    }
    categoriesData[index] = { ...categoriesData[index], ...updates };
    return { ...categoriesData[index] };
  },

  async delete(id) {
    await delay(250);
    const index = categoriesData.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Category not found");
    }
    const deleted = categoriesData.splice(index, 1)[0];
    return { ...deleted };
  }
};