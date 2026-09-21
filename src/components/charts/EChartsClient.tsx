'use client';

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface EChartsClientProps {
  option: any;
  height?: string | number;
  className?: string;
  onEvents?: Record<string, (params: any) => void>;
}

export default function EChartsClient({
  option,
  height = '350px',
  className = '',
  onEvents
}: EChartsClientProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize chart instance with dark theme defaults
    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current, 'dark', {
        renderer: 'canvas',
      });

      if (onEvents) {
        Object.entries(onEvents).forEach(([eventName, handler]) => {
          chartInstanceRef.current?.on(eventName, handler);
        });
      }
    }

    // Apply transparent background to merge seamlessly with card surfaces
    const mergedOption = {
      backgroundColor: 'transparent',
      textStyle: {
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      },
      ...option
    };

    chartInstanceRef.current.setOption(mergedOption, true);

    const handleResize = () => {
      chartInstanceRef.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstanceRef.current?.dispose();
      chartInstanceRef.current = null;
    };
  }, [option, onEvents]);

  return (
    <div
      ref={chartRef}
      style={{ width: '100%', height: typeof height === 'number' ? `${height}px` : height }}
      className={`relative ${className}`}
    />
  );
}
