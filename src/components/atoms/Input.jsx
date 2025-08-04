import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text", 
  label,
  error,
  required,
  ...props 
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 font-body">
          {label}
          {required && <span className="text-accent ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        className={cn(
          "block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg font-body text-gray-900 placeholder-gray-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-gray-50 disabled:cursor-not-allowed min-h-[44px]",
          error && "border-error focus:border-error focus:ring-error/20",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="text-sm text-error font-body">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;