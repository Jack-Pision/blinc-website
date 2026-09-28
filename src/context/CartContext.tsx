"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CartItem, Currency } from "@/types";

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, size: string) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amountInUSD: number) => string;
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
}

const CURRENCY_RATES: Record<Currency, { rate: number; symbol: string; prefix: boolean }> = {
  USD: { rate: 1.0, symbol: "$", prefix: true },
  EUR: { rate: 0.92, symbol: "€", prefix: true },
  GBP: { rate: 0.78, symbol: "£", prefix: true },
  JPY: { rate: 152.0, symbol: "¥", prefix: true },
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const savedCart = localStorage.getItem("blinc_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    try {
      const savedCurrency = localStorage.getItem("blinc_currency") as Currency;
      return savedCurrency && CURRENCY_RATES[savedCurrency] ? savedCurrency : "USD";
    } catch {
      return "USD";
    }
  });

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("blinc_cart", JSON.stringify(items));
      localStorage.setItem("blinc_currency", currency);
    } catch {
      // Ignore localStorage errors
    }
  }, [items, currency]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addItem = (product: Product, size: string) => {
    setItems((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.size === size
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, size, quantity: 1 }];
    });
    setIsOpen(true);
  };

  const removeItem = (productId: string, size: string) => {
    setItems((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.size === size)
      )
    );
  };

  const updateQuantity = (
    productId: string,
    size: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeItem(productId, size);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const formatPrice = (amountInUSD: number) => {
    const config = CURRENCY_RATES[currency];
    const converted = amountInUSD * config.rate;
    if (currency === "JPY") {
      return `${config.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${config.symbol}${converted.toFixed(0)}`;
  };

  const openQuickView = (product: Product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        currency,
        setCurrency,
        formatPrice,
        quickViewProduct,
        openQuickView,
        closeQuickView,
      }}
    >
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
