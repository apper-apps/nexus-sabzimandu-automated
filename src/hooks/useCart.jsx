import React, { createContext, useContext, useReducer, useEffect } from "react";
import { toast } from "react-toastify";
import { recipeBundleService } from "@/services/api/recipeBundleService";
import { loyaltyService } from "@/services/api/loyaltyService";
const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(
        item => item.productId === action.payload.productId && 
                item.selectedWeight === action.payload.selectedWeight
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
        return {
          ...state,
          items: updatedItems
        };
      }

      return {
        ...state,
        items: [...state.items, action.payload]
      };
    }

    case "UPDATE_QUANTITY": {
      const updatedItems = state.items.map(item => {
        if (item.productId === action.payload.productId && 
            item.selectedWeight === action.payload.selectedWeight) {
          return { ...item, quantity: action.payload.quantity };
        }
        return item;
      });

      return {
        ...state,
        items: updatedItems.filter(item => item.quantity > 0)
      };
    }

    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter(item => 
          !(item.productId === action.payload.productId && 
            item.selectedWeight === action.payload.selectedWeight)
        )
      };
    }

    case "CLEAR_CART": {
      return {
        ...state,
        items: []
      };
    }

    case "LOAD_CART": {
      return {
        ...state,
        items: action.payload || []
      };
    }

    default:
      return state;
  }
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("sabziMandu_cart");
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        dispatch({ type: "LOAD_CART", payload: cartData });
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("sabziMandu_cart", JSON.stringify(state.items));
  }, [state.items]);

const addToCart = (product, quantity = 1, selectedWeight = "1kg") => {
    const cartItem = {
      productId: product.Id,
      productName: product.name,
      productNameUrdu: product.nameUrdu,
      quantity,
      selectedWeight,
      price: product.price,
      image: product.images[0],
      unit: product.unit,
      vendorName: product.vendorName
    };

    dispatch({ type: "ADD_ITEM", payload: cartItem });
    
    const pointsEarned = Math.floor((product.price * quantity) / 10);
    if (pointsEarned > 0) {
      toast.success(`${product.name} added to cart! Earn ${pointsEarned} points on purchase.`);
    } else {
      toast.success(`${product.name} added to cart!`);
    }
  };

  const addBundleToCart = async (recipeKey) => {
    try {
      const bundle = await recipeBundleService.getBundle(recipeKey);
      
      bundle.ingredients.forEach(ingredient => {
        const cartItem = {
          productId: ingredient.productId,
          productName: ingredient.name,
          productNameUrdu: ingredient.nameUrdu || ingredient.name,
          quantity: ingredient.quantity,
          selectedWeight: ingredient.weight,
          price: ingredient.price,
          image: ingredient.image || "https://via.placeholder.com/400x400/e5e7eb/9ca3af?text=Bundle+Item",
          unit: ingredient.unit || "kg",
          vendorName: ingredient.vendorName || "SabziMandu"
        };
        
        dispatch({ type: "ADD_ITEM", payload: cartItem });
      });

      toast.success(`${bundle.name} bundle added to cart! Saved ₹${bundle.savings}`, {
        autoClose: 4000
      });
    } catch (error) {
      toast.error("Failed to add bundle to cart");
    }
  };
  const updateQuantity = (productId, selectedWeight, quantity) => {
    dispatch({ 
      type: "UPDATE_QUANTITY", 
      payload: { productId, selectedWeight, quantity } 
    });
  };

  const removeFromCart = (productId, selectedWeight) => {
    dispatch({ 
      type: "REMOVE_ITEM", 
      payload: { productId, selectedWeight } 
    });
    toast.info("Item removed from cart");
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    toast.success("Cart cleared");
  };
const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getItemCount = (productId, selectedWeight) => {
    const item = state.items.find(item => 
      item.productId === productId && item.selectedWeight === selectedWeight
    );
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider value={{
      items: state.items,
      addToCart,
      addBundleToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getTotalItems,
      getTotalPrice,
      getItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};