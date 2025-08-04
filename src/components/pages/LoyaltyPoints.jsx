import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { loyaltyService } from "@/services/api/loyaltyService";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "react-toastify";

const LoyaltyPoints = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [redeeming, setRedeeming] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [balanceData, transactionsData, rewardsData] = await Promise.all([
        loyaltyService.getBalance(),
        loyaltyService.getTransactions(),
        loyaltyService.getRewards()
      ]);
      
      setBalance(balanceData);
      setTransactions(transactionsData);
      setRewards(rewardsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRedeemReward = async (rewardId) => {
    try {
      setRedeeming(rewardId);
      const redemption = await loyaltyService.redeemReward(rewardId);
      
      toast.success(t("Reward redeemed successfully!", "انعام کامیابی سے حاصل کیا گیا!"));
      
      // Refresh data
      await loadData();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setRedeeming(null);
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'purchase': return 'ShoppingCart';
      case 'bonus': return 'Gift';
      case 'redemption': return 'Award';
      default: return 'Circle';
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'purchase': return 'text-success';
      case 'bonus': return 'text-secondary';
      case 'redemption': return 'text-primary';
      default: return 'text-gray-500';
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ApperIcon name="ArrowLeft" size={20} />
            </Button>
            <div>
              <h1 className="text-xl font-display font-bold text-gray-900">
                {t("Sabzi Points", "سبزی پوائنٹس")}
              </h1>
              <p className="text-sm text-gray-600">
                {t("Earn and redeem loyalty points", "وفاداری کے پوائنٹس حاصل کریں اور استعمال کریں")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Points Balance Card */}
      <div className="p-4">
        <Card className="bg-gradient-to-r from-primary to-success text-white mb-4">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Award" size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-display font-bold mb-2">
              {balance.toLocaleString()}
            </h2>
            <p className="text-white/90 font-body">
              {t("Available Points", "دستیاب پوائنٹس")}
            </p>
            <div className="mt-4 text-sm text-white/80">
              {t("Earn 1 point for every Rs. 10 spent", "ہر 10 روپے خرچ کرنے پر 1 پوائنٹ حاصل کریں")}
            </div>
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 mb-4">
        <div className="flex bg-white rounded-lg p-1 shadow-sm">
          <Button
            variant={activeTab === 'overview' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('overview')}
            className="flex-1"
          >
            {t("Overview", "جائزہ")}
          </Button>
          <Button
            variant={activeTab === 'rewards' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('rewards')}
            className="flex-1"
          >
            {t("Rewards", "انعامات")}
          </Button>
          <Button
            variant={activeTab === 'history' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('history')}
            className="flex-1"
          >
            {t("History", "تاریخ")}
          </Button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="px-4 space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 text-center">
              <div className="text-2xl font-display font-bold text-primary mb-1">
                {transactions.filter(t => t.type === 'purchase').reduce((acc, t) => acc + t.points, 0)}
              </div>
              <div className="text-sm text-gray-600">
                {t("Points Earned", "حاصل شدہ پوائنٹس")}
              </div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-display font-bold text-secondary mb-1">
                {Math.abs(transactions.filter(t => t.type === 'redemption').reduce((acc, t) => acc + t.points, 0))}
              </div>
              <div className="text-sm text-gray-600">
                {t("Points Used", "استعمال شدہ پوائنٹس")}
              </div>
            </Card>
          </div>

          {/* Featured Rewards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold text-gray-900">
                {t("Featured Rewards", "نمایاں انعامات")}
              </h3>
              <Button
                variant="link"
                size="sm"
                onClick={() => setActiveTab('rewards')}
              >
                {t("View All", "سب دیکھیں")}
              </Button>
            </div>
            
            <div className="space-y-3">
              {rewards.slice(0, 3).map((reward) => (
                <Card key={reward.Id} className="p-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={reward.image}
                      alt={reward.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {t(reward.title, reward.titleUrdu)}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant="primary" size="sm">
                          {reward.pointsCost} {t("Points", "پوائنٹس")}
                        </Badge>
                        <span className="text-sm text-gray-500 line-through">
                          Rs. {reward.originalPrice}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={balance < reward.pointsCost}
                      onClick={() => handleRedeemReward(reward.Id)}
                    >
                      {balance < reward.pointsCost 
                        ? t("Need More", "مزید درکار") 
                        : t("Redeem", "حاصل کریں")
                      }
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* How to Earn */}
          <Card className="p-4">
            <h3 className="font-display font-semibold text-gray-900 mb-3">
              {t("How to Earn Points", "پوائنٹس کیسے حاصل کریں")}
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <ApperIcon name="ShoppingCart" size={16} className="text-primary" />
                </div>
                <span className="text-sm text-gray-700">
                  {t("Shop and earn 1 point for every Rs. 10", "خریداری کریں اور ہر 10 روپے پر 1 پوائنٹ حاصل کریں")}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                  <ApperIcon name="Star" size={16} className="text-secondary" />
                </div>
                <span className="text-sm text-gray-700">
                  {t("Write reviews and get bonus points", "جائزے لکھیں اور بونس پوائنٹس حاصل کریں")}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                  <ApperIcon name="Users" size={16} className="text-success" />
                </div>
                <span className="text-sm text-gray-700">
                  {t("Refer friends and earn rewards", "دوستوں کو ریفر کریں اور انعامات حاصل کریں")}
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'rewards' && (
        <div className="px-4">
          <div className="grid grid-cols-1 gap-4">
            {rewards.map((reward) => (
              <Card key={reward.Id} className="overflow-hidden">
                <div className="aspect-video bg-gray-100">
                  <img
                    src={reward.image}
                    alt={reward.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-display font-semibold text-gray-900">
                      {t(reward.title, reward.titleUrdu)}
                    </h3>
                    {reward.isAvailable ? (
                      <Badge variant="success" size="sm">
                        {t("Available", "دستیاب")}
                      </Badge>
                    ) : (
                      <Badge variant="error" size="sm">
                        {t("Unavailable", "ناکام")}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    {t(reward.description, reward.descriptionUrdu)}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="primary">
                        {reward.pointsCost} {t("Points", "پوائنٹس")}
                      </Badge>
                      <span className="text-sm text-gray-500 line-through">
                        Rs. {reward.originalPrice}
                      </span>
                    </div>
                    
                    <Button
                      variant={balance >= reward.pointsCost ? "primary" : "outline"}
                      size="sm"
                      disabled={!reward.isAvailable || balance < reward.pointsCost || redeeming === reward.Id}
                      onClick={() => handleRedeemReward(reward.Id)}
                    >
                      {redeeming === reward.Id ? (
                        <ApperIcon name="Loader2" size={16} className="animate-spin" />
                      ) : balance < reward.pointsCost ? (
                        t("Need More Points", "مزید پوائنٹس درکار")
                      ) : (
                        t("Redeem Now", "ابھی حاصل کریں")
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="px-4">
          {transactions.length === 0 ? (
            <Empty
              title={t("No transaction history", "کوئی لین دین کی تاریخ نہیں")}
              message={t("Start shopping to earn your first points!", "اپنے پہلے پوائنٹس حاصل کرنے کے لیے خریداری شروع کریں!")}
              icon="Award"
              actionText={t("Start Shopping", "خریداری شروع کریں")}
              onAction={() => navigate("/categories")}
            />
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <Card key={transaction.Id} className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.points > 0 ? 'bg-success/10' : 'bg-primary/10'
                    }`}>
                      <ApperIcon 
                        name={getTransactionIcon(transaction.type)} 
                        size={20} 
                        className={getTransactionColor(transaction.type)}
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">
                          {transaction.description}
                        </span>
                        <span className={`font-bold ${
                          transaction.points > 0 ? 'text-success' : 'text-primary'
                        }`}>
                          {transaction.points > 0 ? '+' : ''}{transaction.points} {t("pts", "پوائنٹس")}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-1">
                        <Badge variant="outline" size="sm">
                          {transaction.type}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(transaction.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LoyaltyPoints;