'use client';

import React, { useRef, useState, useCallback } from 'react';

interface GlassCard3DProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  onClick?: () => void;
  glareOpacity?: number;
  maxTilt?: number;
  glowColor?: string;
}

export default function GlassCard3D({
  children,
  className = '',
  id,
  onClick,
  glareOpacity = 0.25,
  maxTilt = 7,
  glowColor = 'rgba(191, 161, 97, 0.25)',
}: GlassCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<string>('');
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({ opacity: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Mouse position relative to card center (-1 to 1)
      const x = (e.clientX - rect.left - width / 2) / (width / 2);
      const y = (e.clientY - rect.top - height / 2) / (height / 2);

      const rotateY = x * maxTilt;
      const rotateX = -y * maxTilt;

      // Specular glare position
      const glareX = ((e.clientX - rect.left) / width) * 100;
      const glareY = ((e.clientY - rect.top) / height) * 100;

      setTransformStyle(
        `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`
      );

      setGlareStyle({
        opacity: glareOpacity,
        background: `radial-gradient(circle 380px at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.45), ${glowColor} 25%, transparent 65%)`,
      });
    },
    [maxTilt, glareOpacity, glowColor]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Smooth reset
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlareStyle({ opacity: 0, transition: 'opacity 0.5s ease' });
  };

  return (
    <div
      id={id}
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: isHovered
          ? 'transform 0.08s ease-out'
          : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease',
      }}
      className={`relative rounded-2xl md:rounded-3xl border border-neutral-200/80 dark:border-white/10 border-t-white/90 dark:border-t-white/25 bg-white/80 dark:bg-[#121218]/75 backdrop-blur-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.06),inset_0_1px_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),inset_0_1px_1px_0_rgba(255,255,255,0.18)] preserve-3d overflow-hidden select-none transition-colors duration-200 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Dynamic Specular Glass Glare Reflection */}
      <div
        className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-200"
        style={glareStyle}
      />

      {/* Top Glass Bevel Highlight (Apple visionOS physical light edge) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/30 to-transparent z-30" />

      {/* Inner Content with subtle 3D lift */}
      <div className="relative z-10 preserve-3d translate-z-10">{children}</div>
    </div>
  );
}
