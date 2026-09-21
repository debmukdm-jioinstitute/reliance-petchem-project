'use client';

import React, { useRef, useState } from 'react';

interface CardSpotlightProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  glowColor?: string;
  onClick?: () => void;
}

export default function CardSpotlight({
  children,
  id,
  className = '',
  glowColor = 'rgba(191, 161, 97, 0.15)',
  onClick,
}: CardSpotlightProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      id={id}
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121217] text-neutral-900 dark:text-neutral-100 shadow-sm transition-all duration-200 hover:border-neutral-400 dark:hover:border-neutral-600 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Radial spotlight effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${glowColor}, transparent 40%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
