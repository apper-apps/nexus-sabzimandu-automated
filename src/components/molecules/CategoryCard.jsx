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
    <Card hover onClick={handleClick} className="text-center p-4 touch-target min-h-[120px] flex flex-col justify-center">
      <div className="w-16 h-16 sm:w-18 sm:h-18 mx-auto mb-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300 hover:shadow-xl">
        <ApperIcon name={category.icon} size={24} className="text-white" />
      </div>
      <h3 className="font-display font-semibold text-gray-900 text-sm sm:text-base mb-1 leading-tight">
        {t(category.name, category.nameUrdu)}
      </h3>
      <p className="text-xs text-orange-600 font-body font-medium">
        {category.productCount} {t("items", "اشیاء")}
      </p>
    </Card>
  );
};

export default CategoryCard;