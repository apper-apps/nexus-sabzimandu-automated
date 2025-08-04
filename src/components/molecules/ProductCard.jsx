import React, { useState, useEffect } from "react";
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
  
  // Image loading state management
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [currentImageSrc, setCurrentImageSrc] = useState('');
  
  // Safe access to product images with fallbacks
  const productImages = product?.images || [];
  const primaryImage = productImages[0];
  const fallbackImage = 'https://via.placeholder.com/400x400/e5e7eb/9ca3af?text=No+Image';
  
  // Initialize image source
  useEffect(() => {
    if (primaryImage) {
      setCurrentImageSrc(primaryImage);
      setImageLoading(true);
      setImageError(false);
    } else {
      setCurrentImageSrc(fallbackImage);
      setImageLoading(false);
      setImageError(false);
    }
  }, [primaryImage, fallbackImage]);
  
  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (product?.weightOptions?.[0]) {
      addToCart(product, 1, product.weightOptions[0]);
    }
  };

  const handleCardClick = () => {
    if (product?.Id) {
      navigate(`/product/${product.Id}`);
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    console.warn(`Image loading failed for product ${product?.Id || 'unknown'}:`, currentImageSrc);
    setImageLoading(false);
    
    if (retryCount < 2 && primaryImage !== currentImageSrc) {
      // Try fallback image
      setRetryCount(prev => prev + 1);
      setCurrentImageSrc(fallbackImage);
      setImageError(false);
    } else {
      setImageError(true);
    }
  };

  const handleRetryImage = (e) => {
    e.stopPropagation();
    if (primaryImage) {
      setRetryCount(0);
      setCurrentImageSrc(primaryImage);
      setImageLoading(true);
      setImageError(false);
    }
  };

  // Safe access to product properties
  const itemCount = product?.Id && product?.weightOptions?.[0] 
    ? getItemCount(product.Id, product.weightOptions[0]) 
    : 0;
    
  const freshnessText = product?.harvestDate ? 
    `${Math.ceil((new Date() - new Date(product.harvestDate)) / (1000 * 60 * 60 * 24))} days` : 
    "Fresh";
return (
    <Card hover onClick={handleCardClick} className="h-full flex flex-col">
      <div className="relative">
        {/* Image Loading Skeleton */}
        {imageLoading && (
          <div className="w-full h-32 sm:h-40 bg-gray-200 animate-pulse flex items-center justify-center">
            <ApperIcon name="Image" size={24} className="text-gray-400" />
          </div>
        )}
        
        {/* Image Error State */}
        {imageError ? (
          <div className="w-full h-32 sm:h-40 bg-gray-100 flex flex-col items-center justify-center space-y-2">
            <ApperIcon name="ImageOff" size={20} className="text-gray-400" />
            <button 
              onClick={handleRetryImage}
              className="text-xs text-primary hover:text-primary/80 font-medium"
            >
              {t("Retry", "دوبارہ کوشش")}
            </button>
          </div>
        ) : (
          <img 
            src={currentImageSrc}
            alt={product?.name || t("Product Image", "پروڈکٹ کی تصویر")}
            className={`w-full h-32 sm:h-40 object-cover transition-opacity duration-200 ${
              imageLoading ? 'opacity-0 absolute' : 'opacity-100'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        )}
        
        {product?.isOrganic && (
          <Badge 
            variant="organic" 
            size="sm" 
            className="absolute top-2 left-2"
          >
            {t("Organic", "آرگینک")}
          </Badge>
        )}
<div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2">
          <div className="w-2 h-2 bg-success rounded-full"></div>
        </div>
      </div>
      
<div className="p-3 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="font-display font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
            {t(product?.name || "Product", product?.nameUrdu || "پروڈکٹ")}
          </h3>
          <p className="text-xs text-gray-600 font-body mb-2">
            {product?.vendorName || t("Unknown Vendor", "نامعلوم دکاندار")}
          </p>
          
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1">
<span className="text-lg font-display font-bold text-emerald-600">
                Rs. {(product?.price || 0).toLocaleString()}
              </span>
              <span className="text-xs text-gray-500">/{product?.unit || "unit"}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ApperIcon name="Star" size={12} className="text-warning fill-current" />
              <span className="text-xs text-gray-600">{product?.rating || "N/A"}</span>
            </div>
          </div>
          
{/* Sabzi Points Badge */}
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" size="sm" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
              <ApperIcon name="Award" size={10} className="mr-1" />
              {Math.floor((product?.price || 0) / 10)} {t("Sabzi Points", "سبزی پوائنٹس")}
            </Badge>
          </div>
        </div>
<Button 
          variant="primary" 
          size="sm" 
          onClick={handleAddToCart}
          className="w-full mt-2"
          disabled={!product?.weightOptions?.[0]}
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