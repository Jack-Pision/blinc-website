"use client";

import React, { useState, useRef, MouseEvent, TouchEvent } from "react";
import Image from "next/image";

interface TactileLoupeProps {
  src: string;
  alt: string;
  priority?: boolean;
}

export function TactileLoupe({ src, alt, priority = false }: TactileLoupeProps) {
  const [isInspecting, setIsInspecting] = useState(false);
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setCoords({ x, y });
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((touch.clientY - rect.top) / rect.height) * 100));
    setCoords({ x, y });
  };

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className={`relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-[#f5f5f7] border border-[#e5e5ea] select-none ${
          isInspecting ? "cursor-crosshair" : "cursor-default"
        }`}
      >
        {/* Base Image */}
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-top transition-opacity duration-300"
        />

        {/* Magnified Loupe Lens */}
        {isInspecting && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-200"
            style={{
              backgroundImage: `url(${src})`,
              backgroundPosition: `${coords.x}% ${coords.y}%`,
              backgroundSize: "280%",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Visual reticle / tactile coordinate indicator */}
            <div
              className="absolute w-24 h-24 rounded-full border border-white/80 shadow-2xl backdrop-blur-[1px] -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center"
              style={{
                left: `${coords.x}%`,
                top: `${coords.y}%`,
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
            </div>

            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-white text-[11px] font-medium px-3 py-1 rounded-full shadow-sm">
              Tactile Weave Inspector · 2.8x Macro
            </div>
          </div>
        )}
      </div>

      {/* Loupe Toggle Button */}
      <div className="mt-3 flex items-center justify-between w-full px-2 text-xs">
        <button
          type="button"
          onClick={() => setIsInspecting(!isInspecting)}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
            isInspecting
              ? "bg-[#1d1d1f] text-white shadow-xs"
              : "bg-[#f5f5f7] text-[#515154] hover:text-[#1d1d1f] hover:bg-[#e5e5ea]"
          }`}
        >
          {isInspecting ? "Exit Weave Inspection" : "Inspect Fabric Weave (2.8x)"}
        </button>

        <span className="text-[11px] text-[#86868b] hidden sm:inline">
          {isInspecting
            ? "Move cursor across garment to inspect yarns"
            : "Optical high-density weave zoom"}
        </span>
      </div>
    </div>
  );
}
