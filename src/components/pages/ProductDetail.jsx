import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { productService } from "@/services/api/productService";
import { useCart } from "@/hooks/useCart";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/utils/cn";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, getItemCount } = useCart();
  const { t } = useLanguage();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const productData = await productService.getById(parseInt(id));
      setProduct(productData);
      setSelectedWeight(productData.weightOptions[0]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity, selectedWeight);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity, selectedWeight);
      navigate("/cart");
    }
  };

  const itemCount = product ? getItemCount(product.Id, selectedWeight) : 0;
  const freshnessText = product?.harvestDate ? 
    `${Math.ceil((new Date() - new Date(product.harvestDate)) / (1000 * 60 * 60 * 24))} days fresh` : 
    "Fresh";

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProduct} />;
  if (!product) return <Error message="Product not found" />;

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ApperIcon name="ArrowLeft" size={20} />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
        >
          <ApperIcon name="Share2" size={20} />
        </Button>
      </div>

      {/* Product Images */}
      <div className="relative">
        <div className="aspect-square bg-gray-100">
          <img 
            src={product.images[currentImageIndex]} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        {product.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  index === currentImageIndex ? "bg-white" : "bg-white/50"
                )}
              />
            ))}
          </div>
        )}
        
        {product.isOrganic && (
          <Badge 
            variant="organic" 
            className="absolute top-4 left-4"
          >
            {t("Organic Certified", "آرگینک سرٹیفائیڈ")}
          </Badge>
        )}
        
        <div className="absolute top-4 right-4 glass-effect rounded-full px-3 py-1">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-xs font-body text-gray-700">{freshnessText}</span>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">
            {t(product.name, product.nameUrdu)}
          </h1>
          <p className="text-gray-600 font-body flex items-center">
            <ApperIcon name="Store" size={16} className="mr-2" />
            {product.vendorName}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, index) => (
              <ApperIcon 
                key={index}
                name="Star" 
                size={16} 
                className={cn(
                  index < Math.floor(product.rating) ? "text-warning fill-current" : "text-gray-300"
                )} 
              />
            ))}
          </div>
          <span className="text-sm font-body text-gray-600">
            {product.rating} ({Math.floor(Math.random() * 50) + 10} {t("reviews", "جائزے")})
          </span>
        </div>

{/* Price */}
        <div className="space-y-2">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-display font-bold text-primary">
              Rs. {product.price.toLocaleString()}
            </span>
            <span className="text-gray-500 font-body">/{product.unit}</span>
          </div>
          
          {/* Points Earning Info */}
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-sm">
              <ApperIcon name="Award" size={14} className="mr-1" />
              {t("Earn", "حاصل کریں")} {Math.floor(product.price * quantity / 10)} {t("Sabzi Points", "سبزی پوائنٹس")}
            </Badge>
            <span className="text-xs text-gray-500">
              {t("1 point per Rs. 10", "10 روپے پر 1 پوائنٹ")}
            </span>
          </div>
        </div>
        {/* Weight Selection */}
        <div>
          <h3 className="font-display font-semibold text-gray-900 mb-2">
            {t("Select Weight", "وزن منتخب کریں")}
          </h3>
          <div className="flex flex-wrap gap-2">
            {product.weightOptions.map((weight) => (
              <Button
                key={weight}
                variant={selectedWeight === weight ? "primary" : "outline"}
                size="sm"
                onClick={() => setSelectedWeight(weight)}
              >
                {weight}
              </Button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div>
          <h3 className="font-display font-semibold text-gray-900 mb-2">
            {t("Quantity", "مقدار")}
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-none border-none hover:bg-gray-100"
              >
                <ApperIcon name="Minus" size={16} />
              </Button>
              <span className="px-4 py-2 text-lg font-body font-medium bg-gray-50 min-w-[60px] text-center">
                {quantity}
              </span>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-none border-none hover:bg-gray-100"
              >
                <ApperIcon name="Plus" size={16} />
              </Button>
            </div>
            <div className="text-sm text-gray-600 font-body">
              {t("Total:", "کل:")} Rs. {(product.price * quantity).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Stock Info */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <ApperIcon 
              name={product.stockLevel > 10 ? "CheckCircle" : "AlertTriangle"} 
              size={16} 
              className={product.stockLevel > 10 ? "text-success" : "text-warning"} 
            />
            <span className="text-sm font-body text-gray-700">
              {product.stockLevel > 10 
                ? t("In Stock", "اسٹاک میں") 
                : t(`Only ${product.stockLevel} left`, `صرف ${product.stockLevel} باقی`)
              }
            </span>
          </div>
          <div className="text-sm text-gray-600 font-body">
            {t("Harvest Date:", "فصل کی تاریخ:")} {new Date(product.harvestDate).toLocaleDateString()}
          </div>
        </div>

        {/* Certifications */}
        {product.certification && (
          <div>
            <h3 className="font-display font-semibold text-gray-900 mb-2">
              {t("Certifications", "سرٹیفیکیشن")}
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="success">{product.certification}</Badge>
              {product.isOrganic && (
                <Badge variant="primary">{t("Organic", "آرگینک")}</Badge>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="sticky bottom-20 p-4 bg-white border-t border-gray-200">
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={handleAddToCart}
            className="flex-1"
          >
            {itemCount > 0 ? (
              <span className="flex items-center justify-center space-x-2">
                <span>{t("In Cart", "کارٹ میں")}</span>
                <Badge variant="primary" size="sm">{itemCount}</Badge>
              </span>
            ) : (
              <>
                <ApperIcon name="ShoppingCart" size={16} className="mr-2" />
                {t("Add to Cart", "کارٹ میں شامل کریں")}
              </>
            )}
          </Button>
<Button 
            variant="secondary" 
            onClick={() => {
              const { whatsappService } = require('@/services/api/whatsappService');
              whatsappService.openProductInWhatsApp(product, selectedWeight, quantity);
            }}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white"
          >
            <ApperIcon name="MessageCircle" size={16} className="mr-2" />
            {t("Order via WhatsApp", "واٹس ایپ سے آرڈر")}
          </Button>
          <Button 
            variant="primary" 
            onClick={handleBuyNow}
            className="flex-1"
          >
            <ApperIcon name="Zap" size={16} className="mr-2" />
            {t("Buy Now", "ابھی خریدیں")}
          </Button>
        </div>
        
        {/* WhatsApp Catalog Access */}
        <div className="mt-3">
          <Button 
            variant="outline" 
            onClick={() => navigate("/whatsapp-catalog")}
            className="w-full"
          >
            <ApperIcon name="Catalog" size={16} className="mr-2" />
            {t("View WhatsApp Catalog", "واٹس ایپ کیٹالاگ دیکھیں")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;