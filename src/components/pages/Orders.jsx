import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { orderService } from "@/services/api/orderService";
import { useLanguage } from "@/hooks/useLanguage";
import { format } from "date-fns";

const Orders = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const ordersData = await orderService.getAll();
      setOrders(ordersData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { variant: "info", text: t("Confirmed", "تصدیق شدہ") },
      preparing: { variant: "warning", text: t("Preparing", "تیار ہو رہا") },
      shipped: { variant: "primary", text: t("Shipped", "بھیج دیا") },
      delivered: { variant: "success", text: t("Delivered", "پہنچا دیا") },
      cancelled: { variant: "error", text: t("Cancelled", "منسوخ") }
    };
    
    const config = statusConfig[status] || statusConfig.confirmed;
    return <Badge variant={config.variant} size="sm">{config.text}</Badge>;
  };

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: "warning", text: t("Pending", "زیر التواء") },
      paid: { variant: "success", text: t("Paid", "ادا شدہ") },
      failed: { variant: "error", text: t("Failed", "ناکام") }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant} size="sm">{config.text}</Badge>;
  };

  if (loading) return <Loading type="skeleton" />;
  if (error) return <Error message={error} onRetry={loadOrders} />;

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-4">
        <Empty 
          title={t("No orders yet", "ابھی کوئی آرڈر نہیں")}
          message={t("Your order history will appear here", "آپ کی آرڈر کی تاریخ یہاں نظر آئے گی")}
          icon="Package"
          actionText={t("Start Shopping", "خریداری شروع کریں")}
          onAction={() => navigate("/categories")}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-200">
        <h1 className="text-xl font-display font-bold text-gray-900">
          {t("My Orders", "میرے آرڈرز")} ({orders.length})
        </h1>
      </div>

      {/* Orders List */}
      <div className="p-4 space-y-4">
        {orders.map((order) => (
          <div key={order.Id} className="bg-white rounded-card shadow-card overflow-hidden">
            {/* Order Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-display font-semibold text-gray-900">
                    {t("Order", "آرڈر")} #{order.Id}
                  </p>
                  <p className="text-sm text-gray-600 font-body">
                    {format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")}
                  </p>
                </div>
                <div className="text-right">
                  {getStatusBadge(order.orderStatus)}
                  <p className="text-lg font-display font-bold text-gray-900 mt-1">
                    Rs. {order.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600 font-body">
                    {t("Payment:", "ادائیگی:")} {getPaymentStatusBadge(order.paymentStatus)}
                  </span>
                  <span className="text-gray-600 font-body">
                    {order.items.length} {t("items", "اشیاء")}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-4 space-y-3">
              {order.items.slice(0, 2).map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Package2" size={20} className="text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-medium text-gray-900 truncate">
                      {item.productName}
                    </p>
                    <p className="text-sm text-gray-600 font-body">
                      {item.quantity}x {item.selectedWeight} - Rs. {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {order.items.length > 2 && (
                <p className="text-sm text-gray-600 font-body text-center py-2">
                  {t("and", "اور")} {order.items.length - 2} {t("more items", "مزید اشیاء")}
                </p>
              )}
            </div>

            {/* Delivery Info */}
            <div className="px-4 pb-4">
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="MapPin" size={16} className="text-gray-500" />
                  <p className="text-sm font-body text-gray-700">
                    {order.deliveryAddress.address}, {order.deliveryAddress.city}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Clock" size={16} className="text-gray-500" />
                  <p className="text-sm font-body text-gray-700">
                    {order.deliverySlot}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-4 pb-4 flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate(`/order-confirmation/${order.Id}`)}
                className="flex-1"
              >
                <ApperIcon name="Eye" size={16} className="mr-1" />
                {t("View Details", "تفصیلات دیکھیں")}
              </Button>
              
              {order.orderStatus === "delivered" && (
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => navigate("/categories")}
                  className="flex-1"
                >
                  <ApperIcon name="Repeat" size={16} className="mr-1" />
                  {t("Reorder", "دوبارہ آرڈر")}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;