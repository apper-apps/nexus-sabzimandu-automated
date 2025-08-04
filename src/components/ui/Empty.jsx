import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "Nothing here yet", 
  message = "No items found. Try adjusting your search or browse our categories.",
  actionText = "Browse Categories",
  onAction,
  icon = "Package"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-20 h-20 mb-6 bg-gray-100 rounded-full flex items-center justify-center">
        <ApperIcon name={icon} size={32} className="text-gray-400" />
      </div>
      
      <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 font-body mb-6 max-w-sm">
        {message}
      </p>
      
      {onAction && (
        <Button 
          onClick={onAction}
          variant="primary"
          className="px-6"
        >
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default Empty;