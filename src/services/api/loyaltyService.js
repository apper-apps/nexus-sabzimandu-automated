import loyaltyPointsData from "@/services/mockData/loyaltyPointsData.json";
import rewardsData from "@/services/mockData/rewardsData.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const loyaltyService = {
  // Get user's current points balance
  async getBalance() {
    await delay(300);
    const userPoints = loyaltyPointsData.find(u => u.userId === "user123");
    return userPoints ? userPoints.totalPoints : 0;
  },

  // Get user's points transaction history
  async getTransactions() {
    await delay(400);
    const userPoints = loyaltyPointsData.find(u => u.userId === "user123");
    return userPoints ? [...userPoints.transactions] : [];
  },

  // Add points to user's account
  async addPoints(points, type = 'purchase', description = '') {
    await delay(500);
    let userPoints = loyaltyPointsData.find(u => u.userId === "user123");
    
    if (!userPoints) {
      userPoints = {
        userId: "user123",
        totalPoints: 0,
        transactions: []
      };
      loyaltyPointsData.push(userPoints);
    }

    const transaction = {
      Id: Math.max(...userPoints.transactions.map(t => t.Id), 0) + 1,
      type,
      points,
      description,
      date: new Date().toISOString(),
      status: 'completed'
    };

    userPoints.totalPoints += points;
    userPoints.transactions.unshift(transaction);

    return { ...transaction };
  },

  // Deduct points from user's account
  async deductPoints(points, type = 'redemption', description = '') {
    await delay(500);
    const userPoints = loyaltyPointsData.find(u => u.userId === "user123");
    
    if (!userPoints || userPoints.totalPoints < points) {
      throw new Error("Insufficient points balance");
    }

    const transaction = {
      Id: Math.max(...userPoints.transactions.map(t => t.Id), 0) + 1,
      type,
      points: -points,
      description,
      date: new Date().toISOString(),
      status: 'completed'
    };

    userPoints.totalPoints -= points;
    userPoints.transactions.unshift(transaction);

    return { ...transaction };
  },

  // Get all available rewards
  async getRewards() {
    await delay(400);
    return [...rewardsData];
  },

  // Get reward by ID
  async getRewardById(id) {
    await delay(300);
    const reward = rewardsData.find(r => r.Id === id);
    if (!reward) {
      throw new Error("Reward not found");
    }
    return { ...reward };
  },

  // Redeem a reward
  async redeemReward(rewardId) {
    await delay(600);
    const reward = rewardsData.find(r => r.Id === rewardId);
    if (!reward) {
      throw new Error("Reward not found");
    }

    if (!reward.isAvailable) {
      throw new Error("Reward is currently unavailable");
    }

    const userPoints = loyaltyPointsData.find(u => u.userId === "user123");
    if (!userPoints || userPoints.totalPoints < reward.pointsCost) {
      throw new Error("Insufficient points to redeem this reward");
    }

    // Deduct points
    await this.deductPoints(reward.pointsCost, 'redemption', `Redeemed: ${reward.title}`);

    // Create redemption record
    const redemption = {
      Id: Math.floor(Math.random() * 1000000),
      rewardId: reward.Id,
      rewardTitle: reward.title,
      pointsUsed: reward.pointsCost,
      status: 'confirmed',
      redeemedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)).toISOString() // 30 days
    };

    return redemption;
  },

  // Get user's redemption history
  async getRedemptions() {
    await delay(400);
    const transactions = await this.getTransactions();
    return transactions.filter(t => t.type === 'redemption');
  }
};