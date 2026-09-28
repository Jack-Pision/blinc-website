import React from "react";

interface AsteriskProps {
  className?: string;
  size?: number;
}

export function BrutalistAsterisk({ className = "", size = 28 }: AsteriskProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none inline-block ${className}`}
      aria-hidden="true"
    >
      {/* 8-pointed brutalist geometric star/asterisk */}
      <path d="M22 0H26V48H22z" />
      <path d="M0 22H48V26H0z" />
      <path d="M6.34 38.83L9.17 41.66L41.66 9.17L38.83 6.34z" />
      <path d="M6.34 9.17L38.83 41.66L41.66 38.83L9.17 6.34z" />
    </svg>
  );
}
