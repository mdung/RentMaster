import React from 'react';
import { QuickAction } from '../types';
import './QuickActionsWidget.css';

interface QuickActionsWidgetProps {
  actions: QuickAction[];
  title?: string;
  onActionClick?: (action: QuickAction) => void;
}

export const QuickActionsWidget: React.FC<QuickActionsWidgetProps> = ({
  actions,
  title = "Quick Actions",
  onActionClick
}) => {
  const enabledActions = actions.filter(action => action.enabled);

  return (
    <div className="quick-actions-widget">
      <div className="widget-header">
        <h3 className="widget-title">{title}</h3>
      </div>

      <div className="quick-actions-grid">
        {enabledActions.map((action) => (
          <button
            key={action.id}
            className="quick-action-btn"
            onClick={() => onActionClick?.(action)}
            style={{ '--action-color': action.color } as React.CSSProperties}
          >
            <div className="action-icon" style={{ backgroundColor: action.color }}>
              {action.icon}
            </div>
            
            <div className="action-content">
              <h4 className="action-title">{action.title}</h4>
              <p className="action-description">{action.description}</p>
              
              {action.count !== undefined && (
                <div className="action-count">
                  {action.count}
                </div>
              )}
            </div>
            
            <div className="action-arrow">→</div>
          </button>
        ))}
      </div>

      {enabledActions.length === 0 && (
        <div className="quick-actions-empty">
          <div className="empty-icon">⚡</div>
          <p>No quick actions available</p>
        </div>
      )}
    </div>
  );
};