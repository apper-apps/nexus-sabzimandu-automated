import subscriptionData from "@/services/mockData/subscriptionData.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock user subscriptions data
let userSubscriptions = [
  {
    Id: 1,
    userId: "user123",
    productId: 1,
    productName: "Premium Atta (Wheat Flour)",
    productNameUrdu: "پریمیم آٹا",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop",
    quantity: 2,
    frequency: "bi-weekly", // weekly, bi-weekly, monthly
    subscriptionPrice: 100,
    regularPrice: 120,
    discountPercentage: 17,
    unit: "kg",
    weight: "5kg",
    status: "active", // active, paused, cancelled
    nextDelivery: "2024-01-20",
    startDate: "2024-01-01",
    endDate: null,
    totalOrders: 6,
    totalSavings: 240,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-15T10:30:00.000Z"
  },
  {
    Id: 2,
    userId: "user123",
    productId: 25,
    productName: "Pure Mustard Oil",
    productNameUrdu: "خالص سرسوں کا تیل",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop",
    quantity: 1,
    frequency: "monthly",
    subscriptionPrice: 144,
    regularPrice: 180,
    discountPercentage: 20,
    unit: "liter",
    weight: "1L",
    status: "active",
    nextDelivery: "2024-01-25",
    startDate: "2023-12-01",
    endDate: null,
    totalOrders: 2,
    totalSavings: 72,
    createdAt: "2023-12-01T00:00:00.000Z",
    updatedAt: "2024-01-10T14:20:00.000Z"
  }
];

export const subscriptionService = {
  // Get all available subscription products
  async getAvailableProducts() {
    await delay(400);
    return [...subscriptionData];
  },

  // Get user subscriptions
  async getUserSubscriptions(userId = "user123") {
    await delay(350);
    return userSubscriptions.filter(sub => sub.userId === userId);
  },

  // Get subscription by ID
  async getById(id) {
    await delay(300);
    const subscription = userSubscriptions.find(sub => sub.Id === id);
    if (!subscription) {
      throw new Error("Subscription not found");
    }
    return { ...subscription };
  },

  // Create new subscription
  async create(subscriptionData) {
    await delay(500);
    const maxId = Math.max(...userSubscriptions.map(sub => sub.Id), 0);
    
    // Calculate next delivery date based on frequency
    const nextDelivery = this.calculateNextDelivery(subscriptionData.frequency);
    
    const newSubscription = {
      ...subscriptionData,
      Id: maxId + 1,
      userId: subscriptionData.userId || "user123",
      status: "active",
      nextDelivery,
      startDate: new Date().toISOString().split('T')[0],
      endDate: null,
      totalOrders: 0,
      totalSavings: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    userSubscriptions.push(newSubscription);
    return { ...newSubscription };
  },

  // Update subscription
  async update(id, updates) {
    await delay(400);
    const index = userSubscriptions.findIndex(sub => sub.Id === id);
    if (index === -1) {
      throw new Error("Subscription not found");
    }

    // Recalculate next delivery if frequency changed
    if (updates.frequency && updates.frequency !== userSubscriptions[index].frequency) {
      updates.nextDelivery = this.calculateNextDelivery(updates.frequency);
    }

    userSubscriptions[index] = {
      ...userSubscriptions[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return { ...userSubscriptions[index] };
  },

  // Pause subscription
  async pause(id) {
    await delay(300);
    return this.update(id, { status: "paused" });
  },

  // Resume subscription
  async resume(id) {
    await delay(300);
    const subscription = await this.getById(id);
    const nextDelivery = this.calculateNextDelivery(subscription.frequency);
    
    return this.update(id, { 
      status: "active",
      nextDelivery
    });
  },

  // Cancel subscription
  async cancel(id) {
    await delay(300);
    return this.update(id, { 
      status: "cancelled",
      endDate: new Date().toISOString().split('T')[0]
    });
  },

  // Delete subscription
  async delete(id) {
    await delay(350);
    const index = userSubscriptions.findIndex(sub => sub.Id === id);
    if (index === -1) {
      throw new Error("Subscription not found");
    }
    const deleted = userSubscriptions.splice(index, 1)[0];
    return { ...deleted };
  },

  // Get subscription product by productId
  async getSubscriptionProduct(productId) {
    await delay(200);
    const product = subscriptionData.find(p => p.productId === productId);
    if (!product) {
      throw new Error("Subscription product not found");
    }
    return { ...product };
  },

  // Calculate savings for subscription
  calculateSavings(regularPrice, subscriptionPrice, quantity, frequency) {
    const monthlySavings = (regularPrice - subscriptionPrice) * quantity;
    const frequencyMultiplier = frequency === "weekly" ? 4 : frequency === "bi-weekly" ? 2 : 1;
    return monthlySavings * frequencyMultiplier;
  },

  // Calculate next delivery date
  calculateNextDelivery(frequency, fromDate = new Date()) {
    const date = new Date(fromDate);
    
    switch (frequency) {
      case "weekly":
        date.setDate(date.getDate() + 7);
        break;
      case "bi-weekly":
        date.setDate(date.getDate() + 14);
        break;
      case "monthly":
        date.setMonth(date.getMonth() + 1);
        break;
      default:
        date.setDate(date.getDate() + 7);
    }
    
    return date.toISOString().split('T')[0];
  },

  // Get upcoming deliveries
  async getUpcomingDeliveries(userId = "user123", limit = 5) {
    await delay(250);
    const activeSubscriptions = userSubscriptions
      .filter(sub => sub.userId === userId && sub.status === "active")
      .sort((a, b) => new Date(a.nextDelivery) - new Date(b.nextDelivery))
      .slice(0, limit);
    
    return activeSubscriptions.map(sub => ({
      Id: sub.Id,
      productName: sub.productName,
      productNameUrdu: sub.productNameUrdu,
      image: sub.image,
      quantity: sub.quantity,
      weight: sub.weight,
      deliveryDate: sub.nextDelivery,
      frequency: sub.frequency
    }));
  },

  // Get subscription statistics
  async getSubscriptionStats(userId = "user123") {
    await delay(200);
    const userSubs = userSubscriptions.filter(sub => sub.userId === userId);
    
    const activeCount = userSubs.filter(sub => sub.status === "active").length;
    const pausedCount = userSubs.filter(sub => sub.status === "paused").length;
    const totalSavings = userSubs.reduce((sum, sub) => sum + (sub.totalSavings || 0), 0);
    const totalOrders = userSubs.reduce((sum, sub) => sum + (sub.totalOrders || 0), 0);
    
    return {
      activeSubscriptions: activeCount,
      pausedSubscriptions: pausedCount,
      totalSavings: Math.round(totalSavings),
      totalOrders,
      estimatedMonthlySavings: Math.round(
        userSubs
          .filter(sub => sub.status === "active")
          .reduce((sum, sub) => {
            const frequencyMultiplier = sub.frequency === "weekly" ? 4 : sub.frequency === "bi-weekly" ? 2 : 1;
            return sum + ((sub.regularPrice - sub.subscriptionPrice) * sub.quantity * frequencyMultiplier);
          }, 0)
      )
    };
  }
};