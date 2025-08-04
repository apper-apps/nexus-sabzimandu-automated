import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className, 
  children, 
  hover = false,
  ...props 
}, ref) => {
  return (
    <div
      className={cn(
        "bg-white rounded-card shadow-card border border-gray-100 overflow-hidden",
        hover && "card-hover cursor-pointer",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;