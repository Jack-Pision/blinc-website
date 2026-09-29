"use client";

import React, { createContext, useContext, useState, useMemo, useSyncExternalStore } from "react";
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
  isHydrated: boolean;
}

const CURRENCY_RATES: Record<Currency, { rate: number; symbol: string; prefix: boolean }> = {
  USD: { rate: 1.0, symbol: "$", prefix: true },
  EUR: { rate: 0.92, symbol: "€", prefix: true },
  GBP: { rate: 0.78, symbol: "£", prefix: true },
  JPY: { rate: 152.0, symbol: "¥", prefix: true },
};

const CART_STORAGE_KEY = "blinc_cart";
const CURRENCY_STORAGE_KEY = "blinc_currency";

const emptySubscribe = () => () => {};

// Hydration hook: returns false during SSR and initial hydration, true once mounted
function useIsHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

// Cart external store subscriptions
const cartListeners = new Set<() => void>();
function notifyCartChange() {
  cartListeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // Ignore listener errors
    }
  });
}

function subscribeCart(callback: () => void) {
  cartListeners.add(callback);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", callback);
  }
  return () => {
    cartListeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", callback);
    }
  };
}

let memoryCartJson = "[]";

function getCartSnapshot(): string {
  try {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ?? memoryCartJson;
    }
    return memoryCartJson;
  } catch {
    return memoryCartJson;
  }
}

function getServerCartSnapshot(): string {
  return "[]";
}

function saveCartToStorage(updated: CartItem[]) {
  const json = JSON.stringify(updated);
  memoryCartJson = json;
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(CART_STORAGE_KEY, json);
    }
  } catch {
    // Ignore localStorage errors
  }
  notifyCartChange();
}

// Currency external store subscriptions
const currencyListeners = new Set<() => void>();
function notifyCurrencyChange() {
  currencyListeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // Ignore listener errors
    }
  });
}

function subscribeCurrency(callback: () => void) {
  currencyListeners.add(callback);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", callback);
  }
  return () => {
    currencyListeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", callback);
    }
  };
}

let memoryCurrency: Currency = "USD";

function getCurrencySnapshot(): Currency {
  try {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(CURRENCY_STORAGE_KEY) as Currency;
      if (saved && CURRENCY_RATES[saved]) {
        return saved;
      }
    }
    return memoryCurrency;
  } catch {
    return memoryCurrency;
  }
}

function getServerCurrencySnapshot(): Currency {
  return "USD";
}

function saveCurrencyToStorage(c: Currency) {
  if (!CURRENCY_RATES[c]) return;
  memoryCurrency = c;
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(CURRENCY_STORAGE_KEY, c);
    }
  } catch {
    // Ignore localStorage errors
  }
  notifyCurrencyChange();
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const isHydrated = useIsHydrated();

  const cartJson = useSyncExternalStore(
    subscribeCart,
    getCartSnapshot,
    getServerCartSnapshot
  );

  const currency = useSyncExternalStore(
    subscribeCurrency,
    getCurrencySnapshot,
    getServerCurrencySnapshot
  );

  const items = useMemo<CartItem[]>(() => {
    try {
      const parsed = JSON.parse(cartJson);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [cartJson]);

  const [isOpen, setIsOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addItem = (product: Product, size: string) => {
    let currentItems: CartItem[] = [];
    try {
      const raw = typeof window !== "undefined"
        ? (localStorage.getItem(CART_STORAGE_KEY) ?? memoryCartJson)
        : memoryCartJson;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) currentItems = parsed;
    } catch {
      currentItems = [];
    }

    const existingIndex = currentItems.findIndex(
      (item) => item.product.id === product.id && item.size === size
    );

    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = currentItems.map((item, idx) =>
        idx === existingIndex
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updated = [...currentItems, { product, size, quantity: 1 }];
    }

    saveCartToStorage(updated);
    setIsOpen(true);
  };

  const removeItem = (productId: string, size: string) => {
    let currentItems: CartItem[] = [];
    try {
      const raw = typeof window !== "undefined"
        ? (localStorage.getItem(CART_STORAGE_KEY) ?? memoryCartJson)
        : memoryCartJson;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) currentItems = parsed;
    } catch {
      currentItems = [];
    }

    const updated = currentItems.filter(
      (item) => !(item.product.id === productId && item.size === size)
    );
    saveCartToStorage(updated);
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
    let currentItems: CartItem[] = [];
    try {
      const raw = typeof window !== "undefined"
        ? (localStorage.getItem(CART_STORAGE_KEY) ?? memoryCartJson)
        : memoryCartJson;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) currentItems = parsed;
    } catch {
      currentItems = [];
    }

    const updated = currentItems.map((item) =>
      item.product.id === productId && item.size === size
        ? { ...item, quantity }
        : item
    );
    saveCartToStorage(updated);
  };

  const clearCart = () => {
    saveCartToStorage([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const formatPrice = (amountInUSD: number) => {
    const config = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
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
        setCurrency: saveCurrencyToStorage,
        formatPrice,
        quickViewProduct,
        openQuickView,
        closeQuickView,
        isHydrated,
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
