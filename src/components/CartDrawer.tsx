"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

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

  const freeShippingThreshold = 500;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountRemaining = Math.max(0, freeShippingThreshold - subtotal);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutComplete(true);
      setTimeout(() => {
        clearCart();
        setCheckoutComplete(false);
        closeCart();
      }, 3000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FBFBFA] border-l border-neutral-200 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold tracking-widest uppercase text-neutral-900">
                Shopping Bag
              </h2>
              <p className="text-xs font-mono text-neutral-500 mt-0.5">
                {items.length} {items.length === 1 ? "design" : "designs"} selected
              </p>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-neutral-500 hover:text-black transition-colors"
              aria-label="Close shopping bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Complimentary Shipping Progress */}
          <div className="bg-neutral-100 px-6 py-3 border-b border-neutral-200 text-xs font-mono">
            {amountRemaining > 0 ? (
              <p className="text-neutral-700">
                Add <span className="font-bold text-black">{formatPrice(amountRemaining)}</span> for complimentary insured delivery
              </p>
            ) : (
              <p className="text-emerald-700 font-semibold flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Complimentary insured worldwide delivery unlocked</span>
              </p>
            )}
            <div className="w-full bg-neutral-200 h-1 mt-2 overflow-hidden">
              <div
                className="bg-neutral-900 h-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {checkoutComplete ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-12 h-12 bg-neutral-900 text-white rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-bold uppercase tracking-wider">
                  Order Confirmed
                </h3>
                <p className="text-xs font-mono text-neutral-600 max-w-xs leading-relaxed">
                  Thank you for securing your 2026 Blinc garments. Your bespoke dispatch confirmation has been dispatched.
                </p>
              </div>
            ) : items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                <div className="w-12 h-12 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-400">
                  <span className="font-mono text-xs">00</span>
                </div>
                <h3 className="font-display text-base font-bold uppercase tracking-widest text-neutral-800">
                  Your bag is empty
                </h3>
                <p className="text-xs font-mono text-neutral-500 max-w-xs">
                  Explore our curated 12-piece modern wardrobe to elevate your 2026 silhouette.
                </p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="mt-2 inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-wider bg-neutral-900 text-white px-5 py-2.5 hover:bg-black transition-colors"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.product.id}-${item.size}`}
                  className="flex space-x-4 border-b border-neutral-200 pb-6 last:border-b-0"
                >
                  <div className="relative w-20 h-26 bg-neutral-100 flex-shrink-0 border border-neutral-200 overflow-hidden">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover object-top"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-sans font-medium text-neutral-900 leading-snug">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.product.id, item.size)}
                          className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-3 text-[11px] font-mono text-neutral-500 mt-1">
                        <span>Size: <strong className="text-neutral-900">{item.size}</strong></span>
                        <span>·</span>
                        <span>{item.product.color}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-neutral-300">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.size, item.quantity - 1)
                          }
                          className="p-1 hover:bg-neutral-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3 text-neutral-600" />
                        </button>
                        <span className="px-2.5 text-xs font-mono text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.size, item.quantity + 1)
                          }
                          className="p-1 hover:bg-neutral-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3 text-neutral-600" />
                        </button>
                      </div>

                      <span className="text-xs font-mono font-bold text-neutral-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Actions */}
          {items.length > 0 && !checkoutComplete && (
            <div className="p-6 border-t border-neutral-200 bg-white space-y-4">
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Insured Shipping</span>
                  <span>{amountRemaining === 0 ? "Complimentary" : formatPrice(25)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-100">
                  <span>Estimated Total</span>
                  <span>{formatPrice(amountRemaining === 0 ? subtotal : subtotal + 25)}</span>
                </div>
              </div>

              <button
                disabled={isCheckingOut}
                onClick={handleCheckout}
                className="w-full bg-neutral-950 hover:bg-black text-white py-3.5 text-xs font-mono uppercase tracking-widest font-semibold flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                {isCheckingOut ? (
                  <span className="animate-pulse">Processing Order...</span>
                ) : (
                  <>
                    <span>Secure Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center space-x-2 text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3 text-neutral-400" />
                <span>2026 Encrypted & Carbon-Neutral Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
