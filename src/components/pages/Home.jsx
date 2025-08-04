import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProductCard from "@/components/molecules/ProductCard";
import CategoryCard from "@/components/molecules/CategoryCard";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { productService } from "@/services/api/productService";
import { categoryService } from "@/services/api/categoryService";
import { useLanguage } from "@/hooks/useLanguage";
import { useCart } from "@/hooks/useCart";
import { recipeBundleService } from "@/services/api/recipeBundleService";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { addBundleToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recipeBundles, setRecipeBundles] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
                  <span className="text-2xl font-bold text-primary">
                    ₹{selectedRecipe.totalPrice}
                  </span>
                  <Badge variant="success" className="text-sm">
                    Save ₹{selectedRecipe.savings}
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
        <div className="bg-gradient-to-br from-primary via-primary to-success p-6 text-white">
          <div className="relative z-10">
            <h1 className="text-2xl font-display font-bold mb-2">
              {t("Fresh from Farm to Your Door", "کھیت سے آپ کے دروازے تک تازہ")}
            </h1>
            <p className="text-primary-50 font-body mb-4">
              {t("Quality produce delivered daily", "معیاری اجناس روزانہ فراہم")}
            </p>
            <Button 
              variant="secondary" 
              onClick={() => navigate("/categories")}
              className="px-6"
            >
              {t("Shop Now", "خریداری کریں")}
            </Button>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10"></div>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipeBundles.slice(0, 6).map((bundle) => (
              <div
                key={bundle.key}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedRecipe(bundle)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={bundle.image}
                      alt={bundle.name}
                      className="w-full h-full object-cover"
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
                        ₹{bundle.totalPrice}
                      </span>
                      <Badge variant="success" className="text-xs">
                        Save ₹{bundle.savings}
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
        </section>
      )}

      {/* Quick Categories */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-bold text-gray-900">
            {t("Shop by Category", "قسم کے مطابق خریداری")}
          </h2>
          <Button 
            variant="link" 
            onClick={() => navigate("/categories")}
            className="text-sm"
          >
            {t("View All", "سب دیکھیں")}
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {categories.map((category) => (
            <CategoryCard key={category.Id} category={category} />
          ))}
        </div>
      </div>

      {/* Fresh Deals */}
      <div className="px-4">
        <div className="bg-gradient-to-r from-warning/10 to-secondary/10 rounded-card p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-gray-900 flex items-center">
                <ApperIcon name="Zap" size={18} className="text-warning mr-2" />
                {t("Fresh Deals", "تازہ ڈیلز")}
              </h3>
              <p className="text-sm text-gray-600 font-body">
                {t("Limited time offers", "محدود وقت کی پیشکش")}
              </p>
            </div>
            <Badge variant="warning" size="lg">
              {t("Today Only", "صرف آج")}
            </Badge>
          </div>
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