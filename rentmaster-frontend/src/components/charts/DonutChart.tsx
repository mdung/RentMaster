import React from 'react';
import { ChartDataPoint } from '../../types';
import './DonutChart.css';

interface DonutChartProps {
  data: ChartDataPoint[];
  title?: string;
  size?: number;
  innerRadius?: number;
  showLegend?: boolean;
  showValues?: boolean;
  colors?: string[];
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  title,
  size = 200,
  innerRadius = 0.6,
  showLegend = true,
  showValues = true,
  colors = [
    'var(--primary)',
    'var(--success)',
    'var(--warning)',
    'var(--error)',
    'var(--info)',
    '#8B5CF6',
    '#F59E0B',
    '#EF4444'
  ]
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="donut-chart-container">
        <div className="chart-empty">No data available</div>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = size / 2;
  const innerRadiusValue = radius * innerRadius;
  const center = radius;

  let cumulativePercentage = 0;

  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const startAngle = (cumulativePercentage / 100) * 2 * Math.PI - Math.PI / 2;
    const endAngle = ((cumulativePercentage + percentage) / 100) * 2 * Math.PI - Math.PI / 2;
    
    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);
    
    const x3 = center + innerRadiusValue * Math.cos(endAngle);
    const y3 = center + innerRadiusValue * Math.sin(endAngle);
    const x4 = center + innerRadiusValue * Math.cos(startAngle);
    const y4 = center + innerRadiusValue * Math.sin(startAngle);

    const largeArcFlag = percentage > 50 ? 1 : 0;

    const pathData = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerRadiusValue} ${innerRadiusValue} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
      'Z'
    ].join(' ');

    cumulativePercentage += percentage;

    return {
      ...item,
      pathData,
      percentage,
      color: colors[index % colors.length],
      startAngle,
      endAngle
    };
  });

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  return (
    <div className="donut-chart-container">
      {title && <h4 className="chart-title">{title}</h4>}
      
      <div className="donut-chart-wrapper">
        <div className="donut-chart" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="donut-svg">
            {segments.map((segment, index) => (
              <g key={index}>
                <path
                  d={segment.pathData}
                  fill={segment.color}
                  className="donut-segment"
                  data-label={segment.label}
                  data-value={segment.value}
                  data-percentage={segment.percentage.toFixed(1)}
                />
              </g>
            ))}
          </svg>
          
          {/* Center content */}
          <div className="donut-center">
            <div className="donut-total-value">{formatValue(total)}</div>
            <div className="donut-total-label">Total</div>
          </div>
        </div>

        {showLegend && (
          <div className="donut-legend">
            {segments.map((segment, index) => (
              <div key={index} className="legend-item">
                <div 
                  className="legend-color" 
                  style={{ backgroundColor: segment.color }}
                ></div>
                <div className="legend-content">
                  <div className="legend-label">{segment.label}</div>
                  <div className="legend-value">
                    {showValues && formatValue(segment.value)} ({segment.percentage.toFixed(1)}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};