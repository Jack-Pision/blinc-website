"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { X, Plus, Minus, Trash2, ArrowRight } from "lucide-react";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    subtotal,
    formatPrice,
    clearCart,
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutComplete(true);
      setTimeout(() => {
        clearCart();
        setCheckoutComplete(false);
        closeCart();
      }, 2500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#e5e5ea] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-[#e5e5ea] flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#1d1d1f]">
                Shopping Bag
              </h2>
              <p className="text-xs text-[#86868b] mt-0.5">
                {items.length} {items.length === 1 ? "garment" : "garments"}
              </p>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] rounded-full transition-colors"
              aria-label="Close bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {checkoutComplete ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#f5f5f7] text-[#1d1d1f] flex items-center justify-center text-lg font-semibold">
                  ✓
                </div>
                <h3 className="text-lg font-semibold text-[#1d1d1f]">
                  Order confirmed
                </h3>
                <p className="text-xs text-[#86868b] max-w-xs">
                  Thank you for testing the Blinc 2026 concept store demo.
                </p>
              </div>
            ) : items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-3">
                <p className="text-sm text-[#86868b]">
                  Your bag is currently empty.
                </p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="inline-flex items-center space-x-1.5 text-xs font-medium text-[#1d1d1f] hover:text-[#0071e3] transition-colors"
                >
                  <span>Explore 12-piece collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.product.id}-${item.size}`}
                  className="flex space-x-4 border-b border-[#e5e5ea] pb-6 last:border-b-0"
                >
                  <div className="relative w-20 h-24 bg-[#f5f5f7] rounded-xl flex-shrink-0 overflow-hidden">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover object-top"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-medium text-[#1d1d1f] leading-snug">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.product.id, item.size)}
                          className="text-[#86868b] hover:text-red-600 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-xs text-[#86868b] mt-1">
                        Size: {item.size} · {item.product.color}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center bg-[#f5f5f7] rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.size, item.quantity - 1)
                          }
                          className="p-1.5 text-[#515154] hover:text-[#1d1d1f] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-medium text-[#1d1d1f]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.size, item.quantity + 1)
                          }
                          className="p-1.5 text-[#515154] hover:text-[#1d1d1f] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-medium text-[#1d1d1f]">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout */}
          {items.length > 0 && !checkoutComplete && (
            <div className="p-6 border-t border-[#e5e5ea] bg-[#fbfbfd] space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#86868b]">
                  <span>Subtotal</span>
                  <span className="text-[#1d1d1f]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#86868b]">
                  <span>Standard Shipping</span>
                  <span className="text-emerald-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-[#1d1d1f] pt-2 border-t border-[#e5e5ea]">
                  <span>Total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>

              <button
                disabled={isCheckingOut}
                onClick={handleCheckout}
                className="w-full bg-[#1d1d1f] hover:bg-black text-white py-3 rounded-full text-xs font-medium flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                {isCheckingOut ? (
                  <span>Processing...</span>
                ) : (
                  <span>Checkout</span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
