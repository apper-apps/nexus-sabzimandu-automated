import React from "react";
import { useNavigate } from "react-router-dom";
import CartItem from "@/components/molecules/CartItem";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import { useCart } from "@/hooks/useCart";
import { whatsappService } from "@/services/api/whatsappService";
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
            {t("Shopping Cart", "شاپنگ کارٹ")} ({totalItems} {totalItems === 1 ? t("item", "آٹم") : t("items", "اشیاء")})
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
              <span className="text-gray-600">{t("Subtotal", "ذیلی کل")} ({totalItems} {totalItems === 1 ? t("item", "آٹم") : t("items", "اشیاء")})</span>
              <span className="text-gray-900 font-medium">Rs. {totalPrice.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 flex items-center">
                <ApperIcon name="Award" size={14} className="mr-1 text-orange-500" />
                {t("Sabzi Points Earned", "سبزی پوائنٹس حاصل")}
              </span>
              <span className="text-orange-500 font-semibold">
                +{Math.floor(totalPrice / 10)} {t("Points", "پوائنٹس")}
              </span>
            </div>
            
<div className="flex justify-between">
              <span className="text-gray-600">
                {t("Delivery Fee", "ڈیلیوری فیس")}
              </span>
              <span className={deliveryFee === 0 ? "text-emerald-600 font-semibold" : "text-gray-900 font-medium"}>
                {deliveryFee === 0 ? t("Free", "مفت") : `Rs. ${deliveryFee.toLocaleString()}`}
              </span>
            </div>
            
            {totalPrice > 1500 ? (
              <div className="text-xs text-emerald-600 p-2 bg-emerald-50 rounded flex items-center">
                <ApperIcon name="CheckCircle" size={14} className="mr-1" />
                {t("🎉 You qualify for free delivery!", "🎉 آپ مفت ڈیلیوری کے مستحق ہیں!")}
              </div>
            ) : (
              <div className="text-xs text-amber-600 p-2 bg-amber-50 rounded flex items-center">
                <ApperIcon name="Truck" size={14} className="mr-1" />
                {t(`Add Rs. ${(1500 - totalPrice).toLocaleString()} more for free delivery`, `مفت ڈیلیوری کے لیے ${(1500 - totalPrice).toLocaleString()} روپے اور شامل کریں`)}
              </div>
            )}
            
            <hr className="my-2" />
            
<div className="flex justify-between text-lg font-display font-bold border-t pt-2 mt-2">
              <span className="text-gray-900">{t("Total Amount", "کل رقم")}</span>
              <span className="text-emerald-600">Rs. {finalTotal.toLocaleString()}</span>
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
              whatsappService.openCartOrderInWhatsApp(items, finalTotal, {});
            }}
            className="w-full bg-green-500 hover:bg-green-600 text-white shadow-lg transform transition-all hover:scale-[1.02]"
            size="lg"
          >
            <ApperIcon name="MessageCircle" size={20} className="mr-2" />
            {t("🚀 Order via WhatsApp", "🚀 واٹس ایپ سے آرڈر کریں")}
          </Button>
          
          {/* Traditional Checkout Button */}
<Button 
            variant="outline" 
            onClick={() => navigate("/checkout")}
            className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white transform transition-all hover:scale-[1.02]"
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