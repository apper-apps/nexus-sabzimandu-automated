import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Home from "@/components/pages/Home";
import Categories from "@/components/pages/Categories";
import ProductDetail from "@/components/pages/ProductDetail";
import Cart from "@/components/pages/Cart";
import Checkout from "@/components/pages/Checkout";
import Orders from "@/components/pages/Orders";
import Account from "@/components/pages/Account";
import OrderConfirmation from "@/components/pages/OrderConfirmation";
import LoyaltyPoints from "@/components/pages/LoyaltyPoints";
import WhatsAppCatalog from "@/components/pages/WhatsAppCatalog";
import Subscriptions from "@/components/pages/Subscriptions";
import { CartProvider } from "@/hooks/useCart";
import { LanguageProvider } from "@/hooks/useLanguage";
function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full animate-ping opacity-20"></div>
            <div className="relative w-full h-full bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-display font-bold text-xl">S</span>
            </div>
          </div>
          <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-emerald-600 to-orange-500 bg-clip-text text-transparent mb-2">SabziMandu</h1>
          <p className="text-gray-600 font-body">Fresh from farm to your door...</p>
        </div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <Layout>
<Routes>
                <Route path="/" element={<Home />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/categories/:category" element={<Categories />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
<Route path="/orders" element={<Orders />} />
                <Route path="/account" element={<Account />} />
                <Route path="/subscriptions" element={<Subscriptions />} />
                <Route path="/loyalty-points" element={<LoyaltyPoints />} />
                <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
              </Routes>
            </Layout>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              style={{ zIndex: 9999 }}
            />
          </div>
        </BrowserRouter>
      </CartProvider>
    </LanguageProvider>
  );
}

export default App;