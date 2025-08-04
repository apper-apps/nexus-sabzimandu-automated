import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { categoryService } from "@/services/api/categoryService";
import { productService } from "@/services/api/productService";
import { recipeBundleService } from "@/services/api/recipeBundleService";
import ApperIcon from "@/components/ApperIcon";
import ProductCard from "@/components/molecules/ProductCard";
import CategoryCard from "@/components/molecules/CategoryCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { useLanguage } from "@/hooks/useLanguage";
import { useCart } from "@/hooks/useCart";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
const { t } = useLanguage();
  const { addBundleToCart, addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recipeBundles, setRecipeBundles] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deals] = useState([
    {
      Id: 'deal-1',
      name: 'Biryani Combo Deal',
      nameUrdu: 'بریانی کمبو ڈیل',
      originalPrice: 850,
      price: 650,
      discount: 25,
      unit: 'combo',
      images: ['https://images.unsplash.com/photo-1563379091339-03246963d73a?w=400&h=300&fit=crop'],
      description: 'Complete biryani ingredients with basmati rice, spices, and fresh meat',
      category: 'combo',
      vendorName: 'SabziMandu Deals',
      rating: 4.8,
      weightOptions: ['1 combo']
    },
    {
      Id: 'deal-2', 
      name: 'BBQ Night Special',
      nameUrdu: 'بی بی کیو رات کا خاص',
      originalPrice: 1200,
      price: 899,
      discount: 25,
      unit: 'pack',
      images: ['https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop'],
      description: 'Premium meat cuts with BBQ spices and marinades',
      category: 'combo',
      vendorName: 'SabziMandu Deals',
      rating: 4.9,
      weightOptions: ['1 pack']
    },
    {
      Id: 'deal-3',
      name: 'Desi Breakfast Bundle',
      nameUrdu: 'دیسی ناشتہ بنڈل',
      originalPrice: 450,
      price: 320,
      discount: 29,
      unit: 'bundle',
      images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop'],
      description: 'Traditional Pakistani breakfast essentials - paratha, eggs, and chai',
      category: 'combo',
      vendorName: 'SabziMandu Deals',
      rating: 4.6,
      weightOptions: ['1 bundle']
    }
  ]);
const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [productsData, categoriesData, recipeBundlesData] = await Promise.all([
        productService.getFeatured(),
        categoryService.getAll(),
        productService.getRecipeBundles()
      ]);
      
      setProducts(productsData);
      setCategories(categoriesData.slice(0, 6));
      setRecipeBundles(recipeBundlesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Handle recipe selection from search
    const urlParams = new URLSearchParams(location.search);
    const recipeKey = urlParams.get('recipe');
    const recipeFromState = location.state?.recipe;
    
    if (recipeFromState) {
      setSelectedRecipe(recipeFromState);
    } else if (recipeKey) {
      const bundle = recipeBundles.find(r => r.key === recipeKey);
      if (bundle) {
        setSelectedRecipe(bundle);
      }
    }
  }, [location, recipeBundles]);

  const handleAddBundle = async (recipeKey) => {
    await addBundleToCart(recipeKey);
    setSelectedRecipe(null);
  };
  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
<div className="space-y-6">
      {/* Recipe Mode Section */}
      {selectedRecipe && (
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 gradient-secondary rounded-xl flex items-center justify-center">
                <ApperIcon name="ChefHat" size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-gray-900">
                  {t("Recipe Mode", "ترکیب موڈ")}
                </h2>
                <p className="text-gray-600 text-sm">
                  {t("Complete ingredients for your recipe", "آپ کی ترکیب کے لیے مکمل اجزاء")}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedRecipe(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={selectedRecipe.image}
                  alt={selectedRecipe.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-display font-bold text-gray-900 mb-2">
                  {selectedRecipe.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {selectedRecipe.description}
                </p>
                
                <div className="flex items-center gap-4 mb-4">
<span className="text-2xl font-bold text-primary font-display">
                    Rs. {selectedRecipe.totalPrice.toLocaleString('en-PK')}
                  </span>
                  <Badge variant="success" className="text-sm">
                    Save Rs. {selectedRecipe.savings}
                  </Badge>
                </div>
                
                <Button
                  onClick={() => handleAddBundle(selectedRecipe.key)}
                  className="w-full sm:w-auto"
                >
                  <ApperIcon name="ShoppingCart" size={18} className="mr-2" />
                  {t("Add Complete Bundle", "مکمل بنڈل شامل کریں")}
                </Button>
              </div>
            </div>
            
            {/* Ingredients List */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">
                {t("Included Ingredients:", "شامل اجزاء:")}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {selectedRecipe.ingredients?.slice(0, 8).map((ingredient, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                    <span className="truncate">
                      {ingredient.name} ({ingredient.weight})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

{/* Hero Banner */}
      <div className="relative overflow-hidden">
<div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 p-6 sm:p-8 text-white relative overflow-hidden min-h-[200px] flex items-center">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-orange-500/20"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
          <div className="relative z-10 w-full">
            <h1 className="text-2xl sm:text-3xl font-display font-bold mb-3 leading-tight">
              {t("Fresh from Farm to Your Door", "کھیت سے آپ کے دروازے تک تازہ")}
            </h1>
            <p className="text-emerald-50 font-body mb-6 text-base sm:text-lg max-w-md">
              {t("Quality produce delivered daily across Pakistan", "پاکستان بھر میں معیاری اجناس روزانہ فراہم")}
            </p>
            <Button 
              variant="secondary" 
              onClick={() => navigate("/categories")}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-none shadow-lg font-body font-semibold rounded-full transform hover:scale-105 transition-all duration-200 touch-target"
            >
              <ApperIcon name="ShoppingBag" size={16} className="mr-2" />
              {t("Shop Now", "خریداری کریں")}
            </Button>
          </div>
        </div>
      </div>

{/* Loyalty Points Banner */}
      <div className="px-4">
        <div className="bg-gradient-to-r from-secondary/10 to-warning/10 rounded-xl p-4 border border-secondary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 gradient-secondary rounded-xl flex items-center justify-center">
                <ApperIcon name="Award" size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-display font-bold text-gray-900">
                  {t("Sabzi Points", "سبزی پوائنٹس")}
                </h3>
                <p className="text-sm text-gray-600 font-body">
                  {t("Earn points with every purchase", "ہر خریداری کے ساتھ پوائنٹس حاصل کریں")}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/loyalty-points")}
              className="border-secondary text-secondary hover:bg-secondary hover:text-white"
            >
              {t("View Points", "پوائنٹس دیکھیں")}
            </Button>
          </div>
        </div>
      </div>

{/* Recipe Bundles */}
      {recipeBundles.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-display font-bold text-gray-900 mb-1">
                {t("Recipe Bundles", "ریسپی بنڈلز")}
              </h2>
              <p className="text-gray-600 text-sm">
                {t("Complete ingredients for popular recipes", "مشہور ترکیبوں کے لیے مکمل اجزاء")}
              </p>
            </div>
          </div>

<div className="px-4">
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
              {recipeBundles.slice(0, 8).map((bundle) => (
                <div
                  key={bundle.key}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer flex-shrink-0 w-72"
                  onClick={() => setSelectedRecipe(bundle)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
<img
                        src={bundle.image}
                        alt={bundle.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
                        {bundle.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {bundle.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
                          Rs. {bundle.totalPrice}
                        </span>
                        <Badge variant="success" className="text-xs">
                          Save Rs. {bundle.savings}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {bundle.ingredients?.length} items
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddBundle(bundle.key);
                        }}
                      >
                        <ApperIcon name="Plus" size={14} className="mr-1" />
                        Add Bundle
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* WhatsApp Catalog Banner */}
<div className="px-4">
        <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-xl p-5 border border-green-200 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <ApperIcon name="MessageCircle" size={26} className="text-white" />
              </div>
              <div>
                <h3 className="font-display font-bold text-gray-900 text-lg">
                  {t("Order via WhatsApp", "واٹس ایپ کے ذریعے آرڈر کریں")}
                </h3>
                <p className="text-sm text-gray-600 font-body mt-1">
                  {t("Browse our complete catalog in Pakistani Rupees", "پاکستانی روپے میں ہماری مکمل کیٹالاگ دیکھیں")}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                import('@/services/api/whatsappService').then(({ whatsappService }) => {
                  whatsappService.openCatalogInWhatsApp(products);
                });
              }}
              className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white px-6 py-3 font-body font-semibold rounded-lg transform hover:scale-105 transition-all duration-200 touch-target"
            >
              <ApperIcon name="ExternalLink" size={16} className="mr-2" />
              {t("Open Catalog", "کیٹالاگ کھولیں")}
            </Button>
          </div>
        </div>
      </div>

{/* Quick Categories */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-display font-bold text-gray-900">
            {t("Shop by Category", "قسم کے مطابق خریداری")}
          </h2>
          <Button 
            variant="link" 
            onClick={() => navigate("/categories")}
            className="text-sm font-body font-medium text-emerald-600 hover:text-emerald-700 touch-target"
          >
            {t("View All", "سب دیکھیں")}
            <ApperIcon name="ArrowRight" size={14} className="ml-1" />
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {categories.slice(0, 6).map((category) => (
            <CategoryCard key={category.Id} category={category} />
          ))}
        </div>
      </div>

{/* Special Deals Section */}
      <div className="px-4 mb-6">
        <div className="bg-gradient-to-r from-warning/10 to-secondary/10 rounded-card p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-gray-900 flex items-center">
                <ApperIcon name="Zap" size={18} className="text-warning mr-2" />
                {t("Special Deals", "خصوصی ڈیلز")}
              </h3>
              <p className="text-sm text-gray-600 font-body">
                {t("Pakistani cuisine combos at great prices", "بہترین قیمتوں پر پاکستانی کھانے کے کمبو")}
              </p>
            </div>
            <Badge variant="warning" size="lg">
              {t("Limited Time", "محدود وقت")}
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {deals.map((deal) => (
            <div key={deal.Id} className="bg-white rounded-card shadow-card hover:shadow-elevated transition-all duration-300 hover:scale-105 overflow-hidden">
              <div className="relative">
                <img 
src={deal.images[0]}
                  alt={deal.name}
                  className="w-full h-32 object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <Badge 
                  variant="accent" 
                  size="sm" 
                  className="absolute top-2 left-2"
                >
                  {deal.discount}% {t("OFF", "رعایت")}
                </Badge>
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                </div>
              </div>
              
              <div className="p-3">
                <h4 className="font-display font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                  {t(deal.name, deal.nameUrdu)}
                </h4>
                <p className="text-xs text-gray-600 font-body mb-2 line-clamp-2">
                  {deal.description}
                </p>
                
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 line-through">
                      Rs. {deal.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-lg font-display font-bold text-emerald-600">
                      Rs. {deal.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Star" size={12} className="text-warning fill-current" />
                    <span className="text-xs text-gray-600">{deal.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" size="sm" className="text-xs">
                    <ApperIcon name="Award" size={10} className="mr-1" />
                    {Math.floor(deal.price / 10)} {t("Points", "پوائنٹس")}
                  </Badge>
                  <span className="text-xs text-emerald-600 font-medium">
                    {t("Save", "بچت")} Rs. {(deal.originalPrice - deal.price).toLocaleString()}
                  </span>
                </div>
                
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={() => addToCart(deal, 1, deal.weightOptions[0])}
                  className="w-full mt-2"
                >
                  <ApperIcon name="Plus" size={14} className="mr-1" />
                  {t("Add to Cart", "کارٹ میں شامل کریں")}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-bold text-gray-900">
            {t("Featured Products", "نمایاں مصنوعات")}
          </h2>
          <Button 
            variant="link" 
            onClick={() => navigate("/categories")}
            className="text-sm"
          >
            {t("View All", "سب دیکھیں")}
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product.Id} product={product} />
          ))}
        </div>
      </div>

      {/* Quality Promise */}
      <div className="px-4 pb-6">
        <div className="bg-white rounded-card shadow-card p-6">
          <h3 className="font-display font-bold text-gray-900 text-center mb-4">
            {t("Our Quality Promise", "ہمارا معیاری وعدہ")}
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="w-12 h-12 mx-auto mb-2 bg-success/10 rounded-full flex items-center justify-center">
                <ApperIcon name="Leaf" size={20} className="text-success" />
              </div>
              <p className="text-sm font-body text-gray-700">
                {t("Fresh Daily", "روزانہ تازہ")}
              </p>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center">
                <ApperIcon name="Shield" size={20} className="text-primary" />
              </div>
              <p className="text-sm font-body text-gray-700">
                {t("Quality Assured", "معیار یقینی")}
              </p>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto mb-2 bg-secondary/10 rounded-full flex items-center justify-center">
                <ApperIcon name="Clock" size={20} className="text-secondary" />
              </div>
              <p className="text-sm font-body text-gray-700">
                {t("Fast Delivery", "تیز ترسیل")}
              </p>
            </div>
          </div>
        </div>
      </div>
</div>
  );
};

export default Home;