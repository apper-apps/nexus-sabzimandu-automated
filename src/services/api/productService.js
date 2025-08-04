import productsData from "@/services/mockData/products.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const productService = {
  async getAll() {
    await delay(300);
    return [...productsData];
  },

  async getById(id) {
    await delay(200);
    const product = productsData.find(p => p.Id === id);
    if (!product) {
      throw new Error("Product not found");
    }
    return { ...product };
  },

  async getFeatured() {
    await delay(300);
    return productsData.filter(p => p.rating >= 4.0).slice(0, 12);
  },

  async getByCategory(category) {
    await delay(300);
    return productsData.filter(p => p.category.toLowerCase() === category.toLowerCase());
  },

  async search(query) {
    await delay(400);
    const searchTerm = query.toLowerCase();
    return productsData.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.nameUrdu.includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm)
    );
  },

  async create(product) {
    await delay(500);
    const maxId = Math.max(...productsData.map(p => p.Id), 0);
    const newProduct = {
      ...product,
      Id: maxId + 1,
      createdAt: new Date().toISOString()
    };
    productsData.push(newProduct);
    return { ...newProduct };
  },

  async update(id, updates) {
    await delay(400);
    const index = productsData.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }
    productsData[index] = { ...productsData[index], ...updates };
    return { ...productsData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = productsData.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }
    const deleted = productsData.splice(index, 1)[0];
    return { ...deleted };
  }
};