import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { useLanguage } from "@/hooks/useLanguage";
import { useCart } from "@/hooks/useCart";

const Account = () => {
  const navigate = useNavigate();
  const { language, toggleLanguage, t } = useLanguage();
  const { getTotalItems } = useCart();

  const menuItems = [
    {
      icon: "Package",
      label: t("My Orders", "میرے آرڈرز"),
      description: t("Track your orders", "اپنے آرڈرز کو ٹریک کریں"),
      action: () => navigate("/orders"),
      badge: null
    },
    {
      icon: "ShoppingCart",
      label: t("Shopping Cart", "شاپنگ کارٹ"),
      description: t("View cart items", "کارٹ آئٹمز دیکھیں"),
      action: () => navigate("/cart"),
      badge: getTotalItems() > 0 ? getTotalItems() : null
    },
    {
      icon: "Heart",
      label: t("Wishlist", "پسندیدہ فہرست"),
      description: t("Your favorite products", "آپ کی پسندیدہ مصنوعات"),
      action: () => {},
      badge: null
    },
    {
      icon: "MapPin",
      label: t("Delivery Addresses", "ڈیلیوری ایڈریسز"),
      description: t("Manage your addresses", "اپنے پتے منظم کریں"),
      action: () => {},
      badge: null
    },
    {
      icon: "CreditCard",
      label: t("Payment Methods", "ادائیگی کے طریقے"),
      description: t("Manage payment options", "ادائیگی کے اختیارات منظم کریں"),
      action: () => {},
      badge: null
    },
    {
      icon: "Bell",
      label: t("Notifications", "اطلاعات"),
      description: t("Notification preferences", "اطلاع کی ترجیحات"),
      action: () => {},
      badge: null
    },
    {
      icon: "HelpCircle",
      label: t("Help & Support", "مدد اور سپورٹ"),
      description: t("Get help and support", "مدد اور سپورٹ حاصل کریں"),
      action: () => {},
      badge: null
    },
    {
      icon: "Info",
      label: t("About SabziMandu", "سبزی منڈی کے بارے میں"),
      description: t("Learn more about us", "ہمارے بارے میں مزید جانیں"),
      action: () => {},
      badge: null
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary to-success p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-display font-bold">
              {t("Welcome!", "خوش آمدید!")}
            </h1>
            <p className="text-primary-100 font-body">
              {t("Manage your account", "اپنا اکاؤنٹ منظم کریں")}
            </p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={32} className="text-white" />
          </div>
        </div>

        {/* Language Toggle */}
        <Button
          variant="secondary"
          size="sm"
          onClick={toggleLanguage}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Globe" size={16} />
          <span>{language === "en" ? "Switch to Urdu" : "Switch to English"}</span>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="px-4 -mt-4 mb-6">
        <div className="bg-white rounded-card shadow-card p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-display font-bold text-primary">12</p>
              <p className="text-sm text-gray-600 font-body">{t("Orders", "آرڈرز")}</p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-secondary">Rs. 45K</p>
              <p className="text-sm text-gray-600 font-body">{t("Spent", "خرچ")}</p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-success">95%</p>
              <p className="text-sm text-gray-600 font-body">{t("Satisfaction", "اطمینان")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 space-y-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className="w-full bg-white rounded-card shadow-card p-4 flex items-center space-x-4 hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <ApperIcon name={item.icon} size={20} className="text-primary" />
            </div>
            
            <div className="flex-1 text-left min-w-0">
              <h3 className="font-display font-semibold text-gray-900">
                {item.label}
              </h3>
              <p className="text-sm text-gray-600 font-body truncate">
                {item.description}
              </p>
            </div>
            
            <div className="flex items-center space-x-2 flex-shrink-0">
              {item.badge && (
                <div className="w-6 h-6 gradient-accent rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-body font-bold">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                </div>
              )}
              <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
            </div>
          </button>
        ))}
      </div>

      {/* App Info */}
      <div className="px-4 py-6 text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm">S</span>
          </div>
          <span className="font-display font-bold text-lg gradient-text">SabziMandu</span>
        </div>
        <p className="text-sm text-gray-600 font-body mb-2">
          {t("Fresh produce delivered daily", "تازہ اجناس روزانہ فراہم")}
        </p>
        <p className="text-xs text-gray-500 font-body">
          Version 1.0.0 • {t("Made with ❤️ in Pakistan", "پاکستان میں ❤️ سے بنایا گیا")}
        </p>
      </div>
    </div>
  );
};

export default Account;