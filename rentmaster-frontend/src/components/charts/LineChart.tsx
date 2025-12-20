import React from 'react';
import { ChartDataPoint } from '../../types';
import './LineChart.css';

interface LineChartProps {
  data: ChartDataPoint[];
  title?: string;
  height?: number;
  color?: string;
  showGrid?: boolean;
  showPoints?: boolean;
  formatValue?: (value: number) => string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  height = 300,
  color = 'var(--primary)',
  showGrid = true,
  showPoints = true,
  formatValue = (value) => value.toString()
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container" style={{ height }}>
        <div className="chart-empty">No data available</div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;
  const padding = 40;
  const chartWidth = 100 - (padding * 2 / 300 * 100); // Adjust based on container
  const chartHeight = height - 80; // Account for labels and padding

  // Generate SVG path
  const pathData = data.map((point, index) => {
    const x = (index / (data.length - 1)) * chartWidth + padding;
    const y = height - 40 - ((point.value - minValue) / range) * chartHeight;
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  // Generate grid lines
  const gridLines = [];
  if (showGrid) {
    for (let i = 0; i <= 4; i++) {
      const y = height - 40 - (i / 4) * chartHeight;
      gridLines.push(
        <line
          key={`grid-${i}`}
          x1={padding}
          y1={y}
          x2={chartWidth + padding}
          y2={y}
          stroke="var(--border-color)"
          strokeWidth="1"
          opacity="0.3"
        />
      );
    }
  }

  return (
    <div className="chart-container">
      {title && <h4 className="chart-title">{title}</h4>}
      <div className="line-chart" style={{ height }}>
        <svg width="100%" height={height} className="chart-svg">
          {/* Grid lines */}
          {gridLines}
          
          {/* Area fill */}
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.05" />
            </linearGradient>
          </defs>
          
          <path
            d={`${pathData} L ${chartWidth + padding} ${height - 40} L ${padding} ${height - 40} Z`}
            fill="url(#areaGradient)"
          />
          
          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {showPoints && data.map((point, index) => {
            const x = (index / (data.length - 1)) * chartWidth + padding;
            const y = height - 40 - ((point.value - minValue) / range) * chartHeight;
            
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill={color}
                  stroke="white"
                  strokeWidth="2"
                  className="chart-point"
                />
                <circle
                  cx={x}
                  cy={y}
                  r="8"
                  fill="transparent"
                  className="chart-point-hover"
                  data-value={formatValue(point.value)}
                  data-label={point.label}
                />
              </g>
            );
          })}
          
          {/* X-axis labels */}
          {data.map((point, index) => {
            if (index % Math.ceil(data.length / 6) === 0 || index === data.length - 1) {
              const x = (index / (data.length - 1)) * chartWidth + padding;
              return (
                <text
                  key={`label-${index}`}
                  x={x}
                  y={height - 10}
                  textAnchor="middle"
                  className="chart-label"
                  fontSize="12"
                  fill="var(--text-muted)"
                >
                  {point.label}
                </text>
              );
            }
            return null;
          })}
          
          {/* Y-axis labels */}
          {Array.from({ length: 5 }, (_, i) => {
            const value = minValue + (range * i / 4);
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
        
        {/* Tooltip */}
        <div className="chart-tooltip" id="line-chart-tooltip"></div>
      </div>
    </div>
  );
};