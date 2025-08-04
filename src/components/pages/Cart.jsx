import React from "react";
import { useNavigate } from "react-router-dom";
import CartItem from "@/components/molecules/CartItem";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import { useCart } from "@/hooks/useCart";
import { useLanguage } from "@/hooks/useLanguage";

const Cart = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, getTotalItems, clearCart } = useCart();
  const { t } = useLanguage();
  
  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  const deliveryFee = totalPrice > 1500 ? 0 : 150;
  const finalTotal = totalPrice + deliveryFee;

  const handleClearCart = () => {
    if (window.confirm(t("Are you sure you want to clear your cart?", "کیا آپ واقعی اپنا کارٹ صاف کرنا چاہتے ہیں؟"))) {
      clearCart();
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-4">
        <Empty 
          title={t("Your cart is empty", "آپ کا کارٹ خالی ہے")}
          message={t("Add some fresh produce to get started", "شروع کرنے کے لیے کچھ تازہ اجناس شامل کریں")}
          icon="ShoppingCart"
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
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-display font-bold text-gray-900">
            {t("Shopping Cart", "شاپنگ کارٹ")} ({totalItems})
          </h1>
          {items.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleClearCart}
              className="text-error hover:bg-error/10"
            >
              <ApperIcon name="Trash2" size={16} className="mr-1" />
              {t("Clear", "صاف کریں")}
            </Button>
          )}
        </div>
      </div>

      {/* Cart Items */}
      <div className="px-4 py-4 space-y-3">
        {items.map((item, index) => (
          <CartItem key={`${item.productId}-${item.selectedWeight}-${index}`} item={item} />
        ))}
      </div>

      {/* Order Summary */}
      <div className="px-4 pb-24">
        <div className="bg-white rounded-card shadow-card p-4 space-y-3">
          <h3 className="font-display font-semibold text-gray-900">
            {t("Order Summary", "آرڈر کا خلاصہ")}
          </h3>
          
<div className="space-y-2 text-sm font-body">
            <div className="flex justify-between">
              <span className="text-gray-600">{t("Subtotal", "ذیلی کل")} ({totalItems} {t("items", "اشیاء")})</span>
              <span className="text-gray-900">Rs. {totalPrice.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 flex items-center">
                <ApperIcon name="Award" size={14} className="mr-1 text-secondary" />
                {t("Points You'll Earn", "آپ کو ملنے والے پوائنٹس")}
              </span>
              <span className="text-secondary font-medium">
                {Math.floor(finalTotal / 10)} {t("Points", "پوائنٹس")}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">
                {t("Delivery Fee", "ڈیلیوری فیس")}
                {totalPrice > 1500 && (
                  <span className="text-xs text-success ml-1">({t("Free", "مفت")})</span>
                )}
              </span>
              <span className={deliveryFee === 0 ? "text-success line-through" : "text-gray-900"}>
                Rs. {deliveryFee.toLocaleString()}
              </span>
            </div>
            
            {totalPrice <= 1500 && (
              <div className="text-xs text-info p-2 bg-info/10 rounded">
                {t("Free delivery on orders over Rs. 1,500", "1,500 روپے سے زیادہ کے آرڈر پر مفت ڈیلیوری")}
              </div>
            )}
            
            <hr className="my-2" />
            
            <div className="flex justify-between text-lg font-display font-bold">
              <span className="text-gray-900">{t("Total", "کل")}</span>
              <span className="text-primary">Rs. {finalTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

{/* Action Buttons */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <div className="space-y-3">
          {/* WhatsApp Order Button */}
          <Button 
            variant="primary" 
            onClick={() => {
              const { whatsappService } = require('@/services/api/whatsappService');
              whatsappService.openCartOrderInWhatsApp(items, totalPrice, {});
            }}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
            size="lg"
          >
            <ApperIcon name="MessageCircle" size={20} className="mr-2" />
            {t("Order via WhatsApp", "واٹس ایپ سے آرڈر کریں")}
          </Button>
          
          {/* Traditional Checkout Button */}
          <Button 
            variant="outline" 
            onClick={() => navigate("/checkout")}
            className="w-full"
            size="lg"
          >
            <ApperIcon name="CreditCard" size={20} className="mr-2" />
            {t("Traditional Checkout", "روایتی چیک آؤٹ")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;