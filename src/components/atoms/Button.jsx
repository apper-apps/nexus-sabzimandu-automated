import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  disabled,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-body font-medium rounded-lg transition-all duration-200 touch-target disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "gradient-primary text-white hover:shadow-elevated focus:ring-primary/20 active:scale-95",
    secondary: "gradient-secondary text-white hover:shadow-elevated focus:ring-secondary/20 active:scale-95",
    accent: "gradient-accent text-white hover:shadow-elevated focus:ring-accent/20 active:scale-95",
    outline: "border-2 border-primary text-primary bg-white hover:bg-primary hover:text-white focus:ring-primary/20",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-300/20",
    link: "text-primary hover:text-primary/80 underline-offset-4 hover:underline p-0 h-auto"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm min-h-[36px]",
    md: "px-4 py-2 text-base min-h-[44px]",
    lg: "px-6 py-3 text-lg min-h-[52px]",
    icon: "p-2 min-h-[44px] min-w-[44px]"
  };
  
  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;