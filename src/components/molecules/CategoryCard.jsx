import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { useLanguage } from "@/hooks/useLanguage";

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleClick = () => {
    navigate(`/categories/${category.slug}`);
  };

  return (
    <Card hover onClick={handleClick} className="text-center p-4">
<div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
        <ApperIcon name={category.icon} size={24} className="text-white" />
      </div>
      <h3 className="font-display font-semibold text-gray-900 text-sm mb-1">
        {t(category.name, category.nameUrdu)}
      </h3>
      <p className="text-xs text-orange-600 font-body font-medium">
        {category.productCount} {t("items", "اشیاء")}
      </p>
    </Card>
  );
};

export default CategoryCard;