"use client";

import React, { useState } from "react";
import { TactileProfile } from "@/types";
import { Layers, Feather, Sparkles, Thermometer, Info } from "lucide-react";

interface TactileSensoryMeterProps {
  tactile?: TactileProfile;
}

export function TactileSensoryMeter({ tactile }: TactileSensoryMeterProps) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  if (!tactile) return null;

  const metrics = [
    {
      id: "drape",
      label: "Drape & Movement",
      value: tactile.drape,
      specLabel: tactile.drapeLabel,
      icon: Layers,
      minLabel: "Sculptural",
      maxLabel: "Liquid Fluid",
      description:
        "Measures how the fabric falls against gravity. Lower values hold rigid architectural lines; higher values cascade fluidly with body kinetics.",
    },
    {
      id: "weight",
      label: "Material Weight",
      value: tactile.weight,
      specLabel: tactile.weightLabel,
      icon: Feather,
      minLabel: "Airy",
      maxLabel: "Substantial",
      description:
        "Physical heft on the shoulders and waist. Calculated from certified GSM (grams per square meter) and yarn twist density.",
    },
    {
      id: "finish",
      label: "Surface Finish",
      value: tactile.finish,
      specLabel: tactile.finishLabel,
      icon: Sparkles,
      minLabel: "Chalk Matte",
      maxLabel: "Satin Luster",
      description:
        "Optical light absorption. From raw dry matte wools that absorb light to sandwashed silk and satin accents that reflect subtle sheen.",
    },
    {
      id: "thermal",
      label: "Thermal Comfort",
      value: tactile.thermal,
      specLabel: tactile.thermalLabel,
      icon: Thermometer,
      minLabel: "Cool Season",
      maxLabel: "Deep Winter",
      description:
        "Natural insulative warmth. High ratings utilize brushed air pockets (mohair/alpaca) or dense worsted wool barriers.",
    },
  ];

  return (
    <div className="bg-[#f5f5f7] rounded-3xl p-6 sm:p-7 border border-[#e5e5ea]/80 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-medium text-[#86868b] uppercase tracking-wider block">
            Digital Touch · 2026 Tactile Metric
          </span>
          <h3 className="text-base font-semibold text-[#1d1d1f] tracking-tight mt-0.5">
            Sensory Handfeel Profile
          </h3>
        </div>
        <span className="text-xs font-medium text-[#1d1d1f] bg-white px-3 py-1 rounded-full border border-[#e5e5ea] shadow-xs">
          Milled in Europe
        </span>
      </div>

      {/* Tactile Note Box */}
      <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-[#e5e5ea] text-xs text-[#515154] leading-relaxed flex items-start space-x-2.5">
        <Info className="w-4 h-4 text-[#86868b] flex-shrink-0 mt-0.5" />
        <p className="font-normal italic">
          &ldquo;{tactile.textureNote}&rdquo;
        </p>
      </div>

      {/* 4 Dimension Bars */}
      <div className="space-y-4 pt-1">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const isTooltipOpen = activeTooltip === metric.id;

          return (
            <div key={metric.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() =>
                    setActiveTooltip(isTooltipOpen ? null : metric.id)
                  }
                  className="flex items-center space-x-1.5 text-[#1d1d1f] font-medium hover:text-[#0071e3] transition-colors"
                >
                  <Icon className="w-3.5 h-3.5 text-[#86868b]" />
                  <span>{metric.label}</span>
                </button>
                <span className="text-xs text-[#1d1d1f] font-medium">
                  {metric.specLabel}
                </span>
              </div>

              {/* Gauge Meter: 5 Segments */}
              <div className="grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <div
                    key={lvl}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      lvl <= metric.value
                        ? "bg-[#1d1d1f]"
                        : "bg-[#e5e5ea]"
                    }`}
                  />
                ))}
              </div>

              <div className="flex justify-between text-[10px] text-[#86868b] pt-0.5">
                <span>{metric.minLabel}</span>
                <span>{metric.maxLabel}</span>
              </div>

              {/* Expandable Explanation Tooltip */}
              {isTooltipOpen && (
                <div className="p-3 bg-white rounded-xl border border-[#e5e5ea] text-xs text-[#86868b] leading-relaxed shadow-xs mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  {metric.description}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
