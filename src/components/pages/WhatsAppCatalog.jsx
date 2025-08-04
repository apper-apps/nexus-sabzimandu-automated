import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { productService } from '@/services/api/productService';
import { whatsappService } from '@/services/api/whatsappService';
import { useLanguage } from '@/hooks/useLanguage';

const WhatsAppCatalog = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { key: 'all', name: 'All Products', nameUrdu: 'تمام پروڈکٹس' },
    { key: 'vegetables', name: 'Vegetables', nameUrdu: 'سبزیاں' },
    { key: 'fruits', name: 'Fruits', nameUrdu: 'پھل' },
    { key: 'household', name: 'Household', nameUrdu: 'گھریلو' },
  ];

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const handleOrderProduct = (product) => {
    whatsappService.openProductInWhatsApp(product, product.weightOptions[0], 1);
  };

  const handleOpenFullCatalog = () => {
    whatsappService.openCatalogInWhatsApp(products);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProducts} />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ApperIcon name="ArrowLeft" size={20} />
          </Button>
          <div className="text-center">
            <h1 className="text-lg font-display font-semibold text-gray-900">
              {t("WhatsApp Catalog", "واٹس ایپ کیٹالاگ")}
            </h1>
            <p className="text-sm text-gray-600">
              {t("Order directly via WhatsApp", "واٹس ایپ کے ذریعے آرڈر کریں")}
            </p>
          </div>
          <Button 
            variant="primary" 
            size="sm"
            onClick={handleOpenFullCatalog}
          >
            <ApperIcon name="MessageCircle" size={16} className="mr-1" />
            {t("Open Chat", "چیٹ کھولیں")}
          </Button>
        </div>

        {/* Category Filter */}
        <div className="px-4 pb-3">
          <div className="flex space-x-2 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category.key}
                variant={selectedCategory === category.key ? "primary" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.key)}
                className="whitespace-nowrap"
              >
                {t(category.name, category.nameUrdu)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.Id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gray-100 relative">
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.isOrganic && (
                  <Badge 
                    variant="success" 
                    className="absolute top-2 left-2 text-xs"
                  >
                    {t("Organic", "آرگینک")}
                  </Badge>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-display font-semibold text-gray-900 mb-1">
                  {t(product.name, product.nameUrdu)}
                </h3>
                
                <p className="text-sm text-gray-600 mb-2 flex items-center">
                  <ApperIcon name="Store" size={14} className="mr-1" />
                  {product.vendorName}
                </p>
                
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, index) => (
                      <ApperIcon 
                        key={index}
                        name="Star" 
                        size={12} 
                        className={index < Math.floor(product.rating) ? "text-warning fill-current" : "text-gray-300"} 
                      />
                    ))}
                  </div>
                  <span className="text-xs font-body text-gray-600">
                    {product.rating}
                  </span>
                </div>
                
                <div className="flex items-baseline space-x-1 mb-3">
                  <span className="text-lg font-display font-bold text-primary">
                    Rs. {product.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">/{product.unit}</span>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/product/${product.Id}`)}
                    className="flex-1"
                  >
                    <ApperIcon name="Eye" size={14} className="mr-1" />
                    {t("View", "دیکھیں")}
                  </Button>
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => handleOrderProduct(product)}
                    className="flex-1"
                  >
                    <ApperIcon name="MessageCircle" size={14} className="mr-1" />
                    {t("Order", "آرڈر")}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* WhatsApp Contact Banner */}
      <div className="sticky bottom-0 p-4 bg-green-50 border-t border-green-200">
        <div className="bg-green-500 text-white p-4 rounded-lg text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <ApperIcon name="MessageCircle" size={24} />
            <h3 className="font-display font-semibold">
              {t("Need Help? Chat with us!", "مدد چاہیے؟ ہم سے بات کریں!")}
            </h3>
          </div>
          <p className="text-sm mb-3 opacity-90">
            {t("Get instant support and place orders via WhatsApp", "واٹس ایپ کے ذریعے فوری مدد اور آرڈر کریں")}
          </p>
          <Button 
            variant="secondary"
            onClick={() => {
              const url = whatsappService.getBusinessWhatsAppUrl();
              window.open(url, '_blank');
            }}
            className="bg-white text-green-600 hover:bg-gray-50"
          >
            <ApperIcon name="MessageCircle" size={16} className="mr-2" />
            {t("Start WhatsApp Chat", "واٹس ایپ چیٹ شروع کریں")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppCatalog;