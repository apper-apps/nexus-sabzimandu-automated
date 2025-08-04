import React, { useEffect, useState } from "react";
import { productService } from "@/services/api/productService";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { useLanguage } from "@/hooks/useLanguage";

const SearchBar = ({ onSearch, onRecipeSelect, placeholder }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [recipeSuggestions, setRecipeSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(searchTerm);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setSearchTerm("");
    onSearch?.("");
    setRecipeSuggestions([]);
    setShowSuggestions(false);
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim().length >= 2) {
      try {
        const recipes = await productService.searchRecipes(value);
        setRecipeSuggestions(recipes);
        setShowSuggestions(recipes.length > 0);
      } catch (error) {
        setRecipeSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setRecipeSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleRecipeClick = (recipe) => {
    setSearchTerm("");
    setShowSuggestions(false);
    onRecipeSelect?.(recipe);
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest('.search-container')) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="search-container relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <ApperIcon 
            name="Search" 
            size={18} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
          <Input
            value={searchTerm}
            onChange={handleInputChange}
            placeholder={placeholder || t("Search for fresh produce or recipes...", "تازہ اجناس یا ترکیبیں تلاش کریں...")}
            className="pl-10 pr-12"
          />
{searchTerm && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 w-8 h-8"
          >
            <ApperIcon name="X" size={16} />
          </Button>
        )}
        </div>
      </form>

      {/* Recipe Suggestions Dropdown */}
      {showSuggestions && recipeSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-elevated border border-gray-200 z-50 max-h-80 overflow-y-auto">
          <div className="p-3">
            <div className="flex items-center gap-2 mb-3">
              <ApperIcon name="ChefHat" size={16} className="text-primary" />
              <span className="text-sm font-medium text-gray-700">
                {t("Recipe Suggestions", "ترکیب کی تجاویز")}
              </span>
            </div>
            <div className="space-y-2">
              {recipeSuggestions.map((recipe) => (
                <button
                  key={recipe.key}
                  onClick={() => handleRecipeClick(recipe)}
                  className="w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={recipe.image}
                        alt={recipe.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                        {recipe.name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {recipe.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm font-medium text-primary">
                          ₹{recipe.totalPrice}
                        </span>
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          Save ₹{recipe.savings}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;