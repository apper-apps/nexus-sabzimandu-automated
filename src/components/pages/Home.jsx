import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

const Home = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [productsData, categoriesData] = await Promise.all([
        productService.getFeatured(),
        categoryService.getAll()
      ]);
      
      setProducts(productsData);
      setCategories(categoriesData.slice(0, 6));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
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