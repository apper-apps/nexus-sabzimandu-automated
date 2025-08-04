import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { orderService } from "@/services/api/orderService";
import { useLanguage } from "@/hooks/useLanguage";
import { format } from "date-fns";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const orderData = await orderService.getById(parseInt(orderId));
      setOrder(orderData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const getStatusIcon = (status) => {
    const icons = {
      confirmed: "CheckCircle",
      preparing: "Clock",
      shipped: "Truck",
      delivered: "Package",
      cancelled: "XCircle"
    };
    return icons[status] || "CheckCircle";
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: "text-info",
      preparing: "text-warning",
      shipped: "text-primary",
      delivered: "text-success",
      cancelled: "text-error"
    };
    return colors[status] || "text-info";
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadOrder} />;
  if (!order) return <Error message="Order not found" />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Header */}
      <div className="bg-gradient-to-br from-success via-success to-primary p-6 text-white text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
          <ApperIcon name="CheckCircle" size={40} className="text-white" />
        </div>
        <h1 className="text-2xl font-display font-bold mb-2">
          {t("Order Confirmed!", "آرڈر تصدیق ہو گیا!")}
        </h1>
        <p className="text-success-100 font-body">
          {t("Thank you for your order", "آپ کے آرڈر کے لیے شکریہ")}
        </p>
      </div>

      <div className="p-4 space-y-6">
        {/* Order Summary */}
        <div className="bg-white rounded-card shadow-card p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-display font-bold text-gray-900">
                {t("Order", "آرڈر")} #{order.Id}
              </h2>
              <p className="text-sm text-gray-600 font-body">
                {format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")}
              </p>
            </div>
            <div className="text-right">
              <div className={`flex items-center space-x-2 ${getStatusColor(order.orderStatus)}`}>
                <ApperIcon name={getStatusIcon(order.orderStatus)} size={20} />
                <span className="font-display font-semibold capitalize">
                  {order.orderStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-sm font-body">
            <div className="flex justify-between">
              <span className="text-gray-600">{t("Items", "اشیاء")} ({order.items.length})</span>
              <span>Rs. {(order.totalAmount - (order.totalAmount > 1500 ? 0 : 150)).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("Delivery Fee", "ڈیلیوری فیس")}</span>
              <span>Rs. {(order.totalAmount > 1500 ? 0 : 150).toLocaleString()}</span>
            </div>
            <hr />
            <div className="flex justify-between text-lg font-display font-bold">
              <span>{t("Total Paid", "کل ادا شدہ")}</span>
              <span className="text-primary">Rs. {order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-card shadow-card p-4">
          <h3 className="font-display font-semibold text-gray-900 mb-4">
            {t("Order Items", "آرڈر کی اشیاء")}
          </h3>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center space-x-3 pb-3 border-b border-gray-100 last:border-b-0">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Package2" size={20} className="text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-body font-medium text-gray-900">
                    {item.productName}
                  </h4>
                  <p className="text-sm text-gray-600 font-body">
                    {item.quantity}x {item.selectedWeight}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-body font-semibold text-gray-900">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-white rounded-card shadow-card p-4">
          <h3 className="font-display font-semibold text-gray-900 mb-4">
            {t("Delivery Information", "ڈیلیوری کی معلومات")}
          </h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <ApperIcon name="User" size={16} className="text-gray-500 mt-0.5" />
              <div>
                <p className="font-body font-medium text-gray-900">{order.deliveryAddress.name}</p>
                <p className="text-sm text-gray-600 font-body">{order.deliveryAddress.phone}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <ApperIcon name="MapPin" size={16} className="text-gray-500 mt-0.5" />
              <p className="text-sm font-body text-gray-700">
                {order.deliveryAddress.address}, {order.deliveryAddress.city}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <ApperIcon name="Clock" size={16} className="text-gray-500" />
              <p className="text-sm font-body text-gray-700">
                {order.deliverySlot}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-white rounded-card shadow-card p-4">
          <h3 className="font-display font-semibold text-gray-900 mb-4">
            {t("Payment Information", "ادائیگی کی معلومات")}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ApperIcon 
                name={order.paymentMethod === "cod" ? "Banknote" : "CreditCard"} 
                size={16} 
                className="text-gray-500" 
              />
              <span className="font-body text-gray-700 capitalize">
                {order.paymentMethod === "cod" ? t("Cash on Delivery", "ڈیلیوری پر نقد") : order.paymentMethod}
              </span>
            </div>
            <Badge 
              variant={order.paymentStatus === "paid" ? "success" : "warning"}
              size="sm"
            >
              {order.paymentStatus === "paid" ? t("Paid", "ادا شدہ") : t("Pending", "زیر التواء")}
            </Badge>
          </div>
          {order.transactionId && (
            <div className="mt-2 text-sm text-gray-600 font-body">
              {t("Transaction ID:", "ٹرانزیکشن آئی ڈی:")} {order.transactionId}
            </div>
          )}
        </div>

        {/* Tracking Information */}
        <div className="bg-white rounded-card shadow-card p-4">
          <h3 className="font-display font-semibold text-gray-900 mb-4">
            {t("Order Tracking", "آرڈر ٹریکنگ")}
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                <ApperIcon name="Check" size={16} className="text-white" />
              </div>
              <div>
                <p className="font-body font-medium text-gray-900">{t("Order Confirmed", "آرڈر تصدیق")}</p>
                <p className="text-sm text-gray-600 font-body">
                  {format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 opacity-50">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <ApperIcon name="Package" size={16} className="text-white" />
              </div>
              <div>
                <p className="font-body font-medium text-gray-600">{t("Preparing Order", "آرڈر تیار کرنا")}</p>
                <p className="text-sm text-gray-500 font-body">{t("Estimated in 2-4 hours", "2-4 گھنٹے میں")}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 opacity-50">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <ApperIcon name="Truck" size={16} className="text-white" />
              </div>
              <div>
                <p className="font-body font-medium text-gray-600">{t("Out for Delivery", "ڈیلیوری کے لیے")}</p>
                <p className="text-sm text-gray-500 font-body">{t("Within your selected time slot", "آپ کے منتخب وقت میں")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="sticky bottom-20 p-4 bg-white border-t border-gray-200">
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={() => navigate("/orders")}
            className="flex-1"
          >
            <ApperIcon name="Package" size={16} className="mr-2" />
            {t("View All Orders", "تمام آرڈرز دیکھیں")}
          </Button>
          <Button 
            variant="primary" 
            onClick={() => navigate("/categories")}
            className="flex-1"
          >
            <ApperIcon name="ShoppingCart" size={16} className="mr-2" />
            {t("Continue Shopping", "خریداری جاری رکھیں")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;