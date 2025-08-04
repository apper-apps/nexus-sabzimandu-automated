import React, { useState } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { useLanguage } from "@/hooks/useLanguage";

const SearchBar = ({ onSearch, placeholder }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useLanguage();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm("");
    onSearch?.("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <ApperIcon 
          name="Search" 
          size={18} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
        />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder || t("Search for fresh produce...", "تازہ اجناس تلاش کریں...")}
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
  );
};

export default SearchBar;