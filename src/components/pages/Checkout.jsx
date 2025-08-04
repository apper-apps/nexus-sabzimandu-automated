import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { useCart } from "@/hooks/useCart";
import { useLanguage } from "@/hooks/useLanguage";
import { orderService } from "@/services/api/orderService";
import { loyaltyService } from "@/services/api/loyaltyService";
import { toast } from "react-toastify";
const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();
  const { t } = useLanguage();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "Lahore",
    deliverySlot: "",
    paymentMethod: "cod",
    paymentProof: null,
    transactionId: ""
  });

  const totalPrice = getTotalPrice();
  const deliveryFee = totalPrice > 1500 ? 0 : 150;
  const finalTotal = totalPrice + deliveryFee;

  const cities = [
    "Lahore",
    "Karachi", 
    "Islamabad",
    "Rawalpindi",
    "Faisalabad"
  ];

  const deliverySlots = [
    "8:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM", 
    "12:00 PM - 2:00 PM",
    "2:00 PM - 4:00 PM",
    "4:00 PM - 6:00 PM",
    "6:00 PM - 8:00 PM"
  ];

  const paymentMethods = [
    { key: "cod", label: t("Cash on Delivery", "ڈیلیوری پر نقد"), desc: t("Pay when you receive", "جب آپ کو ملے تو ادائیگی کریں") },
    { key: "jazzcash", label: "JazzCash", desc: t("Mobile wallet payment", "موبائل والیٹ پیمنٹ") },
    { key: "easypaisa", label: "EasyPaisa", desc: t("Mobile wallet payment", "موبائل والیٹ پیمنٹ") },
    { key: "bank", label: t("Bank Transfer", "بینک ٹرانسفر"), desc: t("Direct bank transfer", "براہ راست بینک ٹرانسفر") }
  ];

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const required = ["name", "phone", "address", "deliverySlot"];
    const missing = required.filter(field => !formData[field].trim());
    
    if (missing.length > 0) {
      toast.error(t("Please fill in all required fields", "براہ کرم تمام ضروری فیلڈز بھریں"));
      return false;
    }

    if (formData.paymentMethod !== "cod" && !formData.transactionId.trim()) {
      toast.error(t("Please enter transaction ID", "براہ کرم ٹرانزیکشن آئی ڈی داخل کریں"));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const orderData = {
        items: items.map(item => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          selectedWeight: item.selectedWeight,
          price: item.price
        })),
        totalAmount: finalTotal,
        deliveryAddress: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city
        },
        deliverySlot: formData.deliverySlot,
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentMethod === "cod" ? "pending" : "paid",
        transactionId: formData.transactionId,
        orderStatus: "confirmed"
      };

      const newOrder = await orderService.create(orderData);
clearCart();
      
      // Award loyalty points for the order
      const pointsEarned = Math.floor(finalTotal / 10);
      if (pointsEarned > 0) {
        try {
          await loyaltyService.addPoints(pointsEarned, 'purchase', `Order #${newOrder.Id}`);
          toast.success(t(`Order placed successfully! You earned ${pointsEarned} Sabzi Points!`, `آرڈر کامیابی سے دیا گیا! آپ نے ${pointsEarned} سبزی پوائنٹس حاصل کیے!`));
        } catch (error) {
          toast.success(t("Order placed successfully!", "آرڈر کامیابی سے دیا گیا!"));
        }
      } else {
        toast.success(t("Order placed successfully!", "آرڈر کامیابی سے دیا گیا!"));
      }
      
      navigate(`/order-confirmation/${newOrder.Id}`);
    } catch (error) {
      toast.error(t("Failed to place order", "آرڈر دینے میں ناکام"));
    } finally {
      setLoading(false);
    }
  };

// Handle empty cart navigation in useEffect to prevent setState during render
  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
    }
  }, [items.length, navigate]);

  // Early return for empty cart state
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-200 flex items-center">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate("/cart")}
          className="mr-3"
        >
          <ApperIcon name="ArrowLeft" size={20} />
        </Button>
        <h1 className="text-xl font-display font-bold text-gray-900">
          {t("Checkout", "چیک آؤٹ")}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Order Summary */}
        <div className="bg-white rounded-card shadow-card p-4">
          <h3 className="font-display font-semibold text-gray-900 mb-3">
            {t("Order Summary", "آرڈر کا خلاصہ")}
          </h3>
          <div className="space-y-2 text-sm font-body">
            <div className="flex justify-between">
              <span className="text-gray-600">{t("Items", "اشیاء")} ({items.length})</span>
              <span>Rs. {totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("Delivery", "ڈیلیوری")}</span>
              <span className={deliveryFee === 0 ? "text-success" : ""}>
                Rs. {deliveryFee.toLocaleString()}
                {deliveryFee === 0 && <span className="ml-1">({t("Free", "مفت")})</span>}
              </span>
            </div>
            <hr />
            <div className="flex justify-between text-lg font-display font-bold">
              <span>{t("Total", "کل")}</span>
              <span className="text-primary">Rs. {finalTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-white rounded-card shadow-card p-4 space-y-4">
          <h3 className="font-display font-semibold text-gray-900">
            {t("Delivery Information", "ڈیلیوری کی معلومات")}
          </h3>
          
          <Input
            label={t("Full Name", "پورا نام")}
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder={t("Enter your full name", "اپنا پورا نام درج کریں")}
          />
          
          <Input
            label={t("Phone Number", "فون نمبر")}
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            required
            placeholder="03xxxxxxxxx"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 font-body mb-1">
              {t("City", "شہر")} <span className="text-accent">*</span>
            </label>
            <select
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
              className="block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg font-body text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[44px]"
            >
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 font-body mb-1">
              {t("Complete Address", "مکمل پتہ")} <span className="text-accent">*</span>
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              rows={3}
              placeholder={t("Enter your complete delivery address", "اپنا مکمل ڈیلیوری ایڈریس درج کریں")}
              className="block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg font-body text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 font-body mb-2">
              {t("Delivery Time Slot", "ڈیلیوری کا وقت")} <span className="text-accent">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {deliverySlots.map(slot => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, deliverySlot: slot }))}
                  className={`p-3 text-sm font-body border rounded-lg text-center transition-colors ${
                    formData.deliverySlot === slot 
                      ? "border-primary bg-primary/10 text-primary" 
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-card shadow-card p-4 space-y-4">
          <h3 className="font-display font-semibold text-gray-900">
            {t("Payment Method", "ادائیگی کا طریقہ")}
          </h3>
          
          <div className="space-y-3">
            {paymentMethods.map(method => (
              <label key={method.key} className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.key}
                  checked={formData.paymentMethod === method.key}
                  onChange={handleInputChange}
                  className="mt-1 text-primary focus:ring-primary/20"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-body font-medium text-gray-900">{method.label}</span>
                    {method.key === "cod" && (
                      <Badge variant="warning" size="sm">{t("Popular", "مقبول")}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 font-body">{method.desc}</p>
                </div>
              </label>
            ))}
          </div>
          
          {formData.paymentMethod !== "cod" && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
              <Input
                label={t("Transaction ID", "ٹرانزیکشن آئی ڈی")}
                name="transactionId"
                value={formData.transactionId}
                onChange={handleInputChange}
                placeholder={t("Enter transaction ID", "ٹرانزیکشن آئی ڈی داخل کریں")}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 font-body mb-1">
                  {t("Payment Proof (Optional)", "ادائیگی کا ثبوت (اختیاری)")}
                </label>
                <input
                  type="file"
                  name="paymentProof"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>
            </div>
          )}
        </div>
      </form>

      {/* Place Order Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <Button 
          type="submit"
          variant="primary" 
          onClick={handleSubmit}
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <ApperIcon name="Loader2" size={20} className="mr-2 animate-spin" />
              {t("Placing Order...", "آرڈر دیا جا رہا ہے...")}
            </>
          ) : (
            <>
              <ApperIcon name="CheckCircle" size={20} className="mr-2" />
              {t("Place Order", "آرڈر دیں")} - Rs. {finalTotal.toLocaleString()}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Checkout;