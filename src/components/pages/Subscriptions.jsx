import React, { useState, useEffect } from "react";
import { subscriptionService } from "@/services/api/subscriptionService";
import { useCart } from "@/hooks/useCart";
import { useLanguage } from "@/hooks/useLanguage";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { toast } from "react-toastify";

export default function Subscriptions() {
  const [activeTab, setActiveTab] = useState("browse"); // browse, active, history
  const [availableProducts, setAvailableProducts] = useState([]);
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [stats, setStats] = useState(null);
  const [upcomingDeliveries, setUpcomingDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  const { addToCart } = useCart();
  const { t } = useLanguage();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [products, subscriptions, subscriptionStats, deliveries] = await Promise.all([
        subscriptionService.getAvailableProducts(),
        subscriptionService.getUserSubscriptions(),
        subscriptionService.getSubscriptionStats(),
        subscriptionService.getUpcomingDeliveries()
      ]);

      setAvailableProducts(products);
      setUserSubscriptions(subscriptions);
      setStats(subscriptionStats);
      setUpcomingDeliveries(deliveries);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load subscription data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (product, frequency, quantity) => {
    try {
      setActionLoading(prev => ({ ...prev, [`subscribe-${product.Id}`]: true }));
      
      const subscriptionData = {
        productId: product.productId,
        productName: product.productName,
        productNameUrdu: product.productNameUrdu,
        image: product.image,
        quantity: parseInt(quantity),
        frequency,
        subscriptionPrice: product.subscriptionPrice,
        regularPrice: product.regularPrice,
        discountPercentage: product.discountPercentage,
        unit: product.unit,
        weight: product.weight
      };

      await subscriptionService.create(subscriptionData);
      await loadData();
      
      toast.success(`Subscribed to ${product.productName}! Next delivery in ${frequency === 'weekly' ? '1 week' : frequency === 'bi-weekly' ? '2 weeks' : '1 month'}.`);
      setActiveTab("active");
    } catch (err) {
      toast.error("Failed to create subscription");
    } finally {
      setActionLoading(prev => ({ ...prev, [`subscribe-${product.Id}`]: false }));
    }
  };

  const handlePauseSubscription = async (subscriptionId) => {
    try {
      setActionLoading(prev => ({ ...prev, [`pause-${subscriptionId}`]: true }));
      await subscriptionService.pause(subscriptionId);
      await loadData();
      toast.success("Subscription paused successfully");
    } catch (err) {
      toast.error("Failed to pause subscription");
    } finally {
      setActionLoading(prev => ({ ...prev, [`pause-${subscriptionId}`]: false }));
    }
  };

  const handleResumeSubscription = async (subscriptionId) => {
    try {
      setActionLoading(prev => ({ ...prev, [`resume-${subscriptionId}`]: true }));
      await subscriptionService.resume(subscriptionId);
      await loadData();
      toast.success("Subscription resumed successfully");
    } catch (err) {
      toast.error("Failed to resume subscription");
    } finally {
      setActionLoading(prev => ({ ...prev, [`resume-${subscriptionId}`]: false }));
    }
  };

  const handleCancelSubscription = async (subscriptionId) => {
    if (!window.confirm("Are you sure you want to cancel this subscription?")) {
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, [`cancel-${subscriptionId}`]: true }));
      await subscriptionService.cancel(subscriptionId);
      await loadData();
      toast.success("Subscription cancelled successfully");
    } catch (err) {
      toast.error("Failed to cancel subscription");
    } finally {
      setActionLoading(prev => ({ ...prev, [`cancel-${subscriptionId}`]: false }));
    }
  };

  const handleAddToCart = (subscription) => {
    const product = {
      Id: subscription.productId,
      name: subscription.productName,
      nameUrdu: subscription.productNameUrdu,
      price: subscription.subscriptionPrice,
      images: [subscription.image],
      unit: subscription.unit
    };
    
    addToCart(product, 1, subscription.weight);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getFrequencyText = (frequency) => {
    switch (frequency) {
      case "weekly": return "Weekly";
      case "bi-weekly": return "Bi-weekly";
      case "monthly": return "Monthly";
      default: return frequency;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "success";
      case "paused": return "warning";
      case "cancelled": return "error";
      default: return "secondary";
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-xl font-display font-semibold text-gray-900">
            Subscriptions
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Subscribe & save on household essentials
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Card className="p-3 text-center">
              <div className="text-lg font-semibold text-primary">
                {stats.activeSubscriptions}
              </div>
              <div className="text-xs text-gray-600">Active</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-lg font-semibold text-success">
                ₹{stats.totalSavings}
              </div>
              <div className="text-xs text-gray-600">Total Saved</div>
            </Card>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="max-w-md mx-auto px-4 mb-4">
        <div className="flex bg-gray-100 rounded-lg p-1">
          {[
            { id: "browse", label: "Browse", icon: "Search" },
            { id: "active", label: "Active", icon: "RefreshCw" },
            { id: "deliveries", label: "Upcoming", icon: "Truck" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <ApperIcon name={tab.icon} size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4">
        {activeTab === "browse" && (
          <div className="space-y-4">
            <div className="text-center py-2">
              <h2 className="text-lg font-medium text-gray-900 mb-1">
                Available Subscriptions
              </h2>
              <p className="text-sm text-gray-600">
                Save up to 20% on regular deliveries
              </p>
            </div>
            
            {availableProducts.map((product) => (
              <SubscriptionProductCard
                key={product.Id}
                product={product}
                onSubscribe={handleSubscribe}
                loading={actionLoading[`subscribe-${product.Id}`]}
              />
            ))}
          </div>
        )}

        {activeTab === "active" && (
          <div className="space-y-4">
            {userSubscriptions.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Package" size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Active Subscriptions
                </h3>
                <p className="text-gray-600 mb-4">
                  Start saving with regular deliveries
                </p>
                <Button onClick={() => setActiveTab("browse")}>
                  Browse Products
                </Button>
              </div>
            ) : (
              userSubscriptions.map((subscription) => (
                <ActiveSubscriptionCard
                  key={subscription.Id}
                  subscription={subscription}
                  onPause={handlePauseSubscription}
                  onResume={handleResumeSubscription}
                  onCancel={handleCancelSubscription}
                  onAddToCart={handleAddToCart}
                  loading={actionLoading}
                />
              ))
            )}
          </div>
        )}

        {activeTab === "deliveries" && (
          <div className="space-y-4">
            {upcomingDeliveries.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Truck" size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Upcoming Deliveries
                </h3>
                <p className="text-gray-600">
                  Your next deliveries will appear here
                </p>
              </div>
            ) : (
              upcomingDeliveries.map((delivery) => (
                <Card key={delivery.Id} className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={delivery.image}
                      alt={delivery.productName}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {delivery.productName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {delivery.quantity}x {delivery.weight} • {getFrequencyText(delivery.frequency)}
                      </p>
                      <p className="text-sm text-primary font-medium">
                        {formatDate(delivery.deliveryDate)}
                      </p>
                    </div>
                    <ApperIcon name="ChevronRight" size={20} className="text-gray-400" />
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Subscription Product Card Component
function SubscriptionProductCard({ product, onSubscribe, loading }) {
  const [frequency, setFrequency] = useState(product.availableFrequencies[0]);
  const [quantity, setQuantity] = useState(1);

  return (
    <Card className="p-4">
      <div className="flex gap-3 mb-3">
        <img
          src={product.image}
          alt={product.productName}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-1">
            {product.productName}
          </h3>
          <p className="text-xs text-gray-600 mb-2">
            {product.weight} • {product.vendor}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-primary">
              ₹{product.subscriptionPrice}
            </span>
            <span className="text-sm text-gray-500 line-through">
              ₹{product.regularPrice}
            </span>
            <Badge variant="success" className="text-xs">
              {product.discountPercentage}% OFF
            </Badge>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm"
            >
              {product.availableFrequencies.map((freq) => (
                <option key={freq} value={freq}>
                  {getFrequencyText(freq)}
                </option>
              ))}
            </select>
          </div>
          <div className="w-20">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Qty
            </label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm"
            >
              {Array.from({ length: product.maxQuantity }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-green-50 p-2 rounded-lg">
          <p className="text-xs text-green-700">
            Save ₹{((product.regularPrice - product.subscriptionPrice) * quantity).toFixed(0)} per delivery
          </p>
        </div>

        <Button
          onClick={() => onSubscribe(product, frequency, quantity)}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <ApperIcon name="Loader2" size={16} className="animate-spin" />
              Subscribing...
            </div>
          ) : (
            "Subscribe Now"
          )}
        </Button>
      </div>
    </Card>
  );
}

// Active Subscription Card Component
function ActiveSubscriptionCard({ subscription, onPause, onResume, onCancel, onAddToCart, loading }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex gap-3">
          <img
            src={subscription.image}
            alt={subscription.productName}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <h3 className="font-medium text-gray-900">
              {subscription.productName}
            </h3>
            <p className="text-sm text-gray-600">
              {subscription.quantity}x {subscription.weight} • {getFrequencyText(subscription.frequency)}
            </p>
            <p className="text-sm font-medium text-primary">
              ₹{subscription.subscriptionPrice} each
            </p>
          </div>
        </div>
        <Badge variant={getStatusColor(subscription.status)}>
          {subscription.status}
        </Badge>
      </div>

      {subscription.status === "active" && (
        <div className="bg-blue-50 p-2 rounded-lg mb-3">
          <p className="text-sm text-blue-700">
            <ApperIcon name="Truck" size={14} className="inline mr-1" />
            Next delivery: {formatDate(subscription.nextDelivery)}
          </p>
        </div>
      )}

      <div className="flex gap-2">
        {subscription.status === "active" ? (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPause(subscription.Id)}
              disabled={loading[`pause-${subscription.Id}`]}
              className="flex-1"
            >
              {loading[`pause-${subscription.Id}`] ? (
                <ApperIcon name="Loader2" size={14} className="animate-spin" />
              ) : (
                <ApperIcon name="Pause" size={14} />
              )}
              Pause
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddToCart(subscription)}
              className="flex-1"
            >
              <ApperIcon name="ShoppingCart" size={14} />
              Buy Now
            </Button>
          </>
        ) : subscription.status === "paused" ? (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onResume(subscription.Id)}
              disabled={loading[`resume-${subscription.Id}`]}
              className="flex-1"
            >
              {loading[`resume-${subscription.Id}`] ? (
                <ApperIcon name="Loader2" size={14} className="animate-spin" />
              ) : (
                <ApperIcon name="Play" size={14} />
              )}
              Resume
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancel(subscription.Id)}
              disabled={loading[`cancel-${subscription.Id}`]}
              className="flex-1"
            >
              {loading[`cancel-${subscription.Id}`] ? (
                <ApperIcon name="Loader2" size={14} className="animate-spin" />
              ) : (
                <ApperIcon name="X" size={14} />
              )}
              Cancel
            </Button>
          </>
        ) : null}
      </div>

      {subscription.totalSavings > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <p className="text-xs text-green-600">
            Total saved: ₹{subscription.totalSavings} • {subscription.totalOrders} orders completed
          </p>
        </div>
      )}
</Card>
  );
}