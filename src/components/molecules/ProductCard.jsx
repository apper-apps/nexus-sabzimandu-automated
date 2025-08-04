import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { useCart } from "@/hooks/useCart";
import { useLanguage } from "@/hooks/useLanguage";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, getItemCount } = useCart();
  const { t } = useLanguage();
  
  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1, product.weightOptions[0]);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.Id}`);
  };

  const itemCount = getItemCount(product.Id, product.weightOptions[0]);
  const freshnessText = product.harvestDate ? 
    `${Math.ceil((new Date() - new Date(product.harvestDate)) / (1000 * 60 * 60 * 24))} days` : 
    "Fresh";

  return (
    <Card hover onClick={handleCardClick} className="h-full flex flex-col">
      <div className="relative">
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="w-full h-32 sm:h-40 object-cover"
        />
        {product.isOrganic && (
          <Badge 
            variant="organic" 
            size="sm" 
            className="absolute top-2 left-2"
          >
            {t("Organic", "آرگینک")}
          </Badge>
        )}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-xs font-body text-gray-700">{freshnessText}</span>
          </div>
        </div>
      </div>
      
      <div className="p-3 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="font-display font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
            {t(product.name, product.nameUrdu)}
          </h3>
          <p className="text-xs text-gray-600 font-body mb-2">{product.vendorName}</p>
          
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1">
              <span className="text-lg font-display font-bold text-primary">
                Rs. {product.price.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500">/{product.unit}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ApperIcon name="Star" size={12} className="text-warning fill-current" />
              <span className="text-xs text-gray-600">{product.rating}</span>
            </div>
          </div>
        </div>
        
        <Button 
          variant="primary" 
          size="sm" 
          onClick={handleAddToCart}
          className="w-full mt-2"
        >
          {itemCount > 0 ? (
            <span className="flex items-center justify-center space-x-2">
              <span>{t("In Cart", "کارٹ میں")}</span>
              <Badge variant="secondary" size="sm">{itemCount}</Badge>
            </span>
          ) : (
            <>
              <ApperIcon name="Plus" size={14} className="mr-1" />
              {t("Add to Cart", "کارٹ میں شامل کریں")}
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;