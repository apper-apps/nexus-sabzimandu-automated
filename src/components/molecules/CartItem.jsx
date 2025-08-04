import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { useCart } from "@/hooks/useCart";
import { useLanguage } from "@/hooks/useLanguage";

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { t } = useLanguage();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(item.productId, item.selectedWeight);
    } else {
      updateQuantity(item.productId, item.selectedWeight, newQuantity);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.productId, item.selectedWeight);
  };

  return (
<div className="flex items-center space-x-4 p-4 bg-white rounded-card shadow-card border border-gray-100 hover:shadow-elevated transition-shadow">
      <div className="relative">
        <img 
          src={item.image} 
          alt={item.productName}
          className="w-20 h-20 object-cover rounded-lg border-2 border-gray-100"
        />
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">{item.quantity}</span>
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-display font-semibold text-gray-900 text-base leading-tight mb-1">
          {t(item.productName, item.productNameUrdu)}
        </h3>
        <p className="text-sm text-gray-600 font-body mb-1">
          <ApperIcon name="Store" size={12} className="inline mr-1" />
          {item.vendorName}
        </p>
        <p className="text-sm text-gray-500 font-body mb-2">
          <ApperIcon name="Package" size={12} className="inline mr-1" />
          {item.selectedWeight} • Rs. {item.price.toLocaleString()} each
        </p>
        <p className="text-lg font-display font-bold text-emerald-600">
          Rs. {(item.price * item.quantity).toLocaleString()}
        </p>
      </div>
      
<div className="flex flex-col items-center space-y-3">
        <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="w-10 h-10 rounded-none border-none hover:bg-red-50 hover:text-red-600 touch-target"
          >
            <ApperIcon name="Minus" size={14} />
          </Button>
          <div className="px-4 py-2 bg-gray-50 min-w-[50px] text-center border-x border-gray-200">
            <span className="text-base font-body font-bold text-gray-900">
              {item.quantity}
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="w-10 h-10 rounded-none border-none hover:bg-green-50 hover:text-green-600 touch-target"
          >
            <ApperIcon name="Plus" size={14} />
          </Button>
        </div>
        
<Button 
          variant="ghost" 
          size="sm"
          onClick={handleRemove}
          className="text-error hover:bg-error/10 px-3 py-2 rounded-lg border border-red-200 hover:border-red-300 touch-target"
        >
          <ApperIcon name="Trash2" size={14} className="mr-1" />
          <span className="text-xs font-medium">{t("Remove", "ہٹائیں")}</span>
        </Button>
      </div>
    </div>
  );
};

export default CartItem;