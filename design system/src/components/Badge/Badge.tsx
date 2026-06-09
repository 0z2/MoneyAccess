import React from 'react';
import './badge.css';

export interface BadgeProps {
  value: number;
  color?: string;
  textColor?: string;
  size?: 'm' | 's' | 'xs';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  value,
  color = 'var(--primitive-neutral-4)',
  textColor = 'var(--primitive-default)',
  size = 'm',
  className = '',
}) => {
  const displayValue = value > 99 ? '99+' : value.toString();

  return (
    <div
      className={`ds-badge ds-badge--${size} ${className}`}
      style={{
        backgroundColor: color,
        color: textColor,
      }}
    >
      {displayValue}
    </div>
  );
};
