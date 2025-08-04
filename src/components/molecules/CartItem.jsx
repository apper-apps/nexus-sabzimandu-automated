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
    <div className="flex items-center space-x-4 p-4 bg-white rounded-card shadow-card">
      <img 
        src={item.image} 
        alt={item.productName}
        className="w-16 h-16 object-cover rounded-lg"
      />
      
      <div className="flex-1 min-w-0">
        <h3 className="font-display font-semibold text-gray-900 text-sm truncate">
          {t(item.productName, item.productNameUrdu)}
        </h3>
        <p className="text-xs text-gray-600 font-body">{item.vendorName}</p>
        <p className="text-xs text-gray-500 font-body">{item.selectedWeight}</p>
        <p className="text-sm font-display font-bold text-primary">
          Rs. {(item.price * item.quantity).toLocaleString()}
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="w-8 h-8 rounded-none border-none hover:bg-gray-100"
          >
            <ApperIcon name="Minus" size={12} />
          </Button>
          <span className="px-3 py-1 text-sm font-body font-medium bg-gray-50 min-w-[40px] text-center">
            {item.quantity}
          </span>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="w-8 h-8 rounded-none border-none hover:bg-gray-100"
          >
            <ApperIcon name="Plus" size={12} />
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleRemove}
          className="text-error hover:bg-error/10"
        >
          <ApperIcon name="Trash2" size={16} />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;