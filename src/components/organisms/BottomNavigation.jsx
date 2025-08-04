import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { useCart } from "@/hooks/useCart";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/utils/cn";

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const { t } = useLanguage();
  const totalItems = getTotalItems();

  const navItems = [
    {
      icon: "Home",
      label: t("Home", "ہوم"),
      path: "/",
      key: "home"
    },
    {
      icon: "Grid3X3",
      label: t("Categories", "اقسام"),
      path: "/categories",
      key: "categories"
    },
    {
      icon: "ShoppingCart",
      label: t("Cart", "کارٹ"),
      path: "/cart",
      key: "cart",
      badge: totalItems
    },
    {
      icon: "Package",
      label: t("Orders", "آرڈرز"),
      path: "/orders",
      key: "orders"
    },
    {
      icon: "User",
      label: t("Account", "اکاؤنٹ"),
      path: "/account",
      key: "account"
    }
  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
      <div className="flex justify-around items-center py-2 px-1">
        {navItems.map((item) => (
          <Button
            key={item.key}
            variant="ghost"
            onClick={() => navigate(item.path)}
            className={cn(
              "flex flex-col items-center space-y-1 p-2 min-h-[60px] min-w-[60px] rounded-lg transition-all duration-200 touch-target",
              isActive(item.path) 
                ? "text-emerald-600 bg-emerald-50" 
                : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
            )}
          >
            <div className="relative">
              <ApperIcon name={item.icon} size={20} />
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-xs text-white font-body font-bold shadow-sm">
                  {item.badge > 9 ? "9+" : item.badge}
                </span>
              )}
            </div>
            <span className="text-xs font-body font-medium leading-none">
              {item.label}
            </span>
          </Button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;