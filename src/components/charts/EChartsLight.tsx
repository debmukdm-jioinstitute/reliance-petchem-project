'use client';

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface EChartsLightProps {
  option: any;
  height?: string | number;
  className?: string;
}

/**
 * Chart wrapper for cream/white pages. EChartsClient forces echarts' built-in
 * "dark" theme regardless of option overrides; this one stays neutral so
 * light-theme axis/label colors set in each option render correctly.
 */
export default function EChartsLight({ option, height = '360px', className = '' }: EChartsLightProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current, undefined, { renderer: 'canvas' });
    }

    const mergedOption = {
      backgroundColor: 'transparent',
      textStyle: {
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      },
      ...option
    };

    chartInstanceRef.current.setOption(mergedOption, true);

    const handleResize = () => chartInstanceRef.current?.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [option]);

  useEffect(() => {
    return () => {
      chartInstanceRef.current?.dispose();
      chartInstanceRef.current = null;
    };
  }, []);

  return (
    <div
      ref={chartRef}
      style={{ width: '100%', height: typeof height === 'number' ? `${height}px` : height }}
      className={`relative ${className}`}
    />
  );
}
