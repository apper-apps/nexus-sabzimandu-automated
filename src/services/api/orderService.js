import ordersData from "@/services/mockData/orders.json";
import { loyaltyService } from "./loyaltyService";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export const orderService = {
  async getAll() {
    await delay(400);
    return [...ordersData];
  },

  async getById(id) {
    await delay(300);
    const order = ordersData.find(o => o.Id === id);
    if (!order) {
      throw new Error("Order not found");
    }
    return { ...order };
  },

  async getUserOrders(userId) {
    await delay(350);
    return ordersData.filter(o => o.userId === userId);
  },

  async create(order) {
    await delay(500);
    const maxId = Math.max(...ordersData.map(o => o.Id), 0);
    const newOrder = {
      ...order,
      Id: maxId + 1,
      userId: "user123", // Mock user ID
      createdAt: new Date().toISOString(),
updatedAt: new Date().toISOString()
    };
    ordersData.push(newOrder);
    
    // Award loyalty points automatically (1 point per Rs. 10)
    const pointsEarned = Math.floor(newOrder.totalAmount / 10);
    if (pointsEarned > 0) {
      try {
        await loyaltyService.addPoints(pointsEarned, 'purchase', `Order #${newOrder.Id}`);
      } catch (error) {
        console.warn('Failed to award loyalty points:', error);
      }
    }
    
    return { ...newOrder };
  },

  async update(id, updates) {
    await delay(400);
    const index = ordersData.findIndex(o => o.Id === id);
    if (index === -1) {
      throw new Error("Order not found");
    }
    ordersData[index] = { 
      ...ordersData[index], 
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return { ...ordersData[index] };
  },

  async updateStatus(id, status) {
    await delay(300);
    return this.update(id, { orderStatus: status });
  },

  async delete(id) {
    await delay(350);
    const index = ordersData.findIndex(o => o.Id === id);
    if (index === -1) {
      throw new Error("Order not found");
    }
    const deleted = ordersData.splice(index, 1)[0];
    return { ...deleted };
  }
};