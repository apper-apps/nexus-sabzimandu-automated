import productsData from "@/services/mockData/products.json";
import { recipeBundleService } from "@/services/api/recipeBundleService";

// Removed delay for better performance
export const productService = {
async getAll() {
    return [...productsData];
  },

  async getById(id) {
// Removed delay for better performance
    const product = productsData.find(p => p.Id === id);
    if (!product) {
      throw new Error("Product not found");
    }
    return { ...product };
  },

async getFeatured() {
    return productsData.filter(p => p.rating >= 4.0).slice(0, 12);
  },

  async getByCategory(category) {
// Removed delay for better performance
    return productsData.filter(p => p.category.toLowerCase() === category.toLowerCase());
  },

async search(query) {
    const searchTerm = query.toLowerCase();
    return productsData.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.nameUrdu.includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm)
    );
  },
async create(product) {
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
    const index = productsData.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }
    productsData[index] = { ...productsData[index], ...updates };
    return { ...productsData[index] };
  },

  async delete(id) {
// Removed delay for better performance
    const index = productsData.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }
    const deleted = productsData.splice(index, 1)[0];
    return { ...deleted };
  },

  async searchRecipes(query) {
    return await recipeBundleService.searchRecipes(query);
  },

  async getRecipeBundle(recipeKey) {
    return await recipeBundleService.getBundle(recipeKey);
  },

  async getRecipeBundles() {
    return await recipeBundleService.getAllBundles();
  }
};