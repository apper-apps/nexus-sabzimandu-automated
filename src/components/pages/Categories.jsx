import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ProductCard from "@/components/molecules/ProductCard";
import CategoryCard from "@/components/molecules/CategoryCard";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { productService } from "@/services/api/productService";
import { categoryService } from "@/services/api/categoryService";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/utils/cn";

const Categories = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const searchTerm = searchParams.get("search");
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (category) {
        const categoryProducts = await productService.getByCategory(category);
        setProducts(categoryProducts);
      } else if (searchTerm) {
        const searchResults = await productService.search(searchTerm);
        setProducts(searchResults);
      } else {
        const [allProducts, allCategories] = await Promise.all([
          productService.getAll(),
          categoryService.getAll()
        ]);
        setProducts(allProducts);
        setCategories(allCategories);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [category, searchTerm]);

  const filteredProducts = products.filter(product => {
    if (selectedFilter === "organic") return product.isOrganic;
    if (selectedFilter === "fresh") {
      const daysOld = Math.ceil((new Date() - new Date(product.harvestDate)) / (1000 * 60 * 60 * 24));
      return daysOld <= 2;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price_low":
        return a.price - b.price;
      case "price_high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "fresh":
        return new Date(b.harvestDate) - new Date(a.harvestDate);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const filters = [
    { key: "all", label: t("All", "تمام"), count: products.length },
    { key: "organic", label: t("Organic", "آرگینک"), count: products.filter(p => p.isOrganic).length },
    { key: "fresh", label: t("Fresh Today", "آج تازہ"), count: products.filter(p => {
      const daysOld = Math.ceil((new Date() - new Date(p.harvestDate)) / (1000 * 60 * 60 * 24));
      return daysOld <= 2;
    }).length }
  ];

  const sortOptions = [
    { key: "name", label: t("Name", "نام") },
    { key: "price_low", label: t("Price: Low to High", "قیمت: کم سے زیادہ") },
    { key: "price_high", label: t("Price: High to Low", "قیمت: زیادہ سے کم") },
    { key: "rating", label: t("Rating", "ریٹنگ") },
    { key: "fresh", label: t("Freshness", "تازگی") }
  ];

  const getPageTitle = () => {
    if (searchTerm) return t(`Search results for "${searchTerm}"`, `"${searchTerm}" کے نتائج`);
    if (category) {
      const categoryData = categories.find(cat => cat.slug === category);
      return categoryData ? t(categoryData.name, categoryData.nameUrdu) : category;
    }
    return t("All Categories", "تمام اقسام");
  };

  if (loading) return <Loading type="grid" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="px-4 py-4 bg-white border-b border-gray-200">
        <h1 className="text-xl font-display font-bold text-gray-900 mb-2">
          {getPageTitle()}
        </h1>
        {sortedProducts.length > 0 && (
          <p className="text-sm text-gray-600 font-body">
            {sortedProducts.length} {t("products found", "مصنوعات ملیں")}
          </p>
        )}
      </div>

      {/* Categories Grid (if not in specific category) */}
      {!category && !searchTerm && categories.length > 0 && (
        <div className="px-4">
          <h2 className="text-lg font-display font-semibold text-gray-900 mb-3">
            {t("Browse Categories", "اقسام دیکھیں")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {categories.map((cat) => (
              <CategoryCard key={cat.Id} category={cat} />
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      {products.length > 0 && (
        <div className="px-4 space-y-3">
          {/* Filter Chips */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <Button
                key={filter.key}
                variant={selectedFilter === filter.key ? "primary" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter.key)}
                className="whitespace-nowrap flex-shrink-0"
              >
                {filter.label}
                <Badge 
                  variant={selectedFilter === filter.key ? "secondary" : "gray"} 
                  size="sm" 
                  className="ml-2"
                >
                  {filter.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-body text-gray-600">
              {t("Sort by:", "ترتیب:")}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-body bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {sortOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="px-4 pb-6">
        {sortedProducts.length === 0 ? (
          <Empty 
            title={t("No products found", "کوئی مصنوعات نہیں ملیں")}
            message={t("Try adjusting your filters or search terms", "اپنے فلٹرز یا تلاش کی شرائط تبدیل کرنے کی کوشش کریں")}
            icon="Search"
            actionText={t("Clear Filters", "فلٹرز صاف کریں")}
            onAction={() => {
              setSelectedFilter("all");
              setSortBy("name");
            }}
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedProducts.map((product) => (
              <ProductCard key={product.Id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;