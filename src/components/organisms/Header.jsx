import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import { useCart } from "@/hooks/useCart";
import { useLanguage } from "@/hooks/useLanguage";

const Header = () => {
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const { language, toggleLanguage, t } = useLanguage();
  const totalItems = getTotalItems();

const handleSearch = (searchTerm) => {
    if (searchTerm.trim()) {
      navigate(`/categories?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleRecipeSelect = (recipe) => {
    navigate(`/?recipe=${recipe.key}`, { state: { recipe } });
  };

return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 py-3">
        {/* Top row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate("/")}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-display font-bold text-sm">S</span>
              </div>
              <div>
                <h1 className="font-display font-bold text-lg bg-gradient-to-r from-emerald-600 to-orange-500 bg-clip-text text-transparent">SabziMandu</h1>
              </div>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="w-10 h-10 hover:bg-emerald-50"
            >
              <span className="text-sm font-body font-medium text-emerald-600">
                {language === "en" ? "اردو" : "EN"}
              </span>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/cart")}
              className="relative w-10 h-10 hover:bg-orange-50"
            >
              <ApperIcon name="ShoppingCart" size={20} className="text-orange-600" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-xs text-white font-body font-bold shadow-md">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Button>
          </div>
        </div>
        
        {/* Search bar */}
        <SearchBar onSearch={handleSearch} onRecipeSelect={handleRecipeSelect} />
      </div>
    </header>
  );
};

export default Header;