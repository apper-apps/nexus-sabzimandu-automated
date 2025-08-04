import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  message = "Something went wrong while loading data", 
  onRetry,
  title = "Oops!" 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 mb-6 gradient-accent rounded-full flex items-center justify-center">
        <ApperIcon name="AlertTriangle" size={24} className="text-white" />
      </div>
      
      <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 font-body mb-6 max-w-sm">
        {message}
      </p>
      
      {onRetry && (
        <Button 
          onClick={onRetry}
          variant="primary"
          className="px-6"
        >
          <ApperIcon name="RefreshCw" size={16} className="mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;