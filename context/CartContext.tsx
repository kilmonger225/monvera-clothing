"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import toast from "react-hot-toast";

export interface CartItem {
  id: string; 
  productId: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
  maxStock: number; 
}

interface CartContextType {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // 1. Load the cart from memory when the app loads
  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem("monvera_cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart items from local storage");
      }
    }
  }, []);

  // 2. Save the cart to memory every time it changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("monvera_cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isMounted]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addToCart = (newItem: Omit<CartItem, "id">) => {
    // Generate a unique ID based on the product AND the chosen size
    const id = `${newItem.productId}-${newItem.size}`;
    
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === id);
      
      if (existingItem) {
        // Prevent exceeding stock if added again
        if (existingItem.quantity + newItem.quantity > existingItem.maxStock) {
          toast.error(`Only ${existingItem.maxStock} available in stock!`, {
            style: { background: '#ef4444', color: '#fff' }
          });
          return prev;
        }
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + newItem.quantity } : item
        );
      }
      return [...prev, { ...newItem, id }];
    });
    
    // Automatically open the cart drawer when an item is added
    setIsOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          // Cap the quantity at maxStock
          if (quantity > item.maxStock) {
            toast.error(`Stock limit reached!`);
            return { ...item, quantity: item.maxStock };
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      isOpen, 
      openCart, 
      closeCart, 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      cartCount 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}