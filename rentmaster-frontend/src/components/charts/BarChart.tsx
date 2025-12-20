import React from 'react';
import { ChartDataPoint } from '../../types';
import './BarChart.css';

interface BarChartProps {
  data: ChartDataPoint[];
  title?: string;
  height?: number;
  color?: string;
  showGrid?: boolean;
  showValues?: boolean;
  formatValue?: (value: number) => string;
  horizontal?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  height = 300,
  color = 'var(--primary)',
  showGrid = true,
  showValues = true,
  formatValue = (value) => value.toString(),
  horizontal = false
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container" style={{ height }}>
        <div className="chart-empty">No data available</div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const padding = 40;
  const chartHeight = height - 80;
  const barWidth = (100 - padding) / data.length;

  return (
    <div className="chart-container">
      {title && <h4 className="chart-title">{title}</h4>}
      
      <div className="bar-chart" style={{ height }}>
        <svg width="100%" height={height} className="chart-svg">
          {/* Grid lines */}
          {showGrid && Array.from({ length: 5 }, (_, i) => {
            const y = height - 40 - (i / 4) * chartHeight;
            return (
              <line
                key={`grid-${i}`}
                x1={padding}
                y1={y}
                x2="95%"
                y2={y}
                stroke="var(--border-color)"
                strokeWidth="1"
                opacity="0.3"
              />
            );
          })}
          
          {/* Bars */}
          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * chartHeight;
            const x = padding + (index * barWidth) + barWidth * 0.1;
            const y = height - 40 - barHeight;
            const width = barWidth * 0.8;
            
            return (
              <g key={index}>
                {/* Bar */}
                <rect
                  x={`${x}%`}
                  y={y}
                  width={`${width}%`}
                  height={barHeight}
                  fill={color}
                  className="bar-segment"
                  data-label={item.label}
                  data-value={item.value}
                  rx="4"
                />
                
                {/* Value label */}
                {showValues && (
                  <text
                    x={`${x + width / 2}%`}
                    y={y - 5}
                    textAnchor="middle"
                    className="bar-value"
                    fontSize="12"
                    fill="var(--text-secondary)"
                  >
                    {formatValue(item.value)}
                  </text>
                )}
                
                {/* X-axis label */}
                <text
                  x={`${x + width / 2}%`}
                  y={height - 10}
                  textAnchor="middle"
                  className="chart-label"
                  fontSize="12"
                  fill="var(--text-muted)"
                >
                  {item.label}
                </text>
              </g>
            );
          })}
          
          {/* Y-axis labels */}
          {Array.from({ length: 5 }, (_, i) => {
            const value = (maxValue * i / 4);
            const y = height - 40 - (i / 4) * chartHeight;
            return (
              <text
                key={`y-label-${i}`}
                x={padding - 10}
                y={y + 4}
                textAnchor="end"
                className="chart-label"
                fontSize="12"
                fill="var(--text-muted)"
              >
                {formatValue(value)}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
};