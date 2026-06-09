import React from 'react';
import './cell.css';
import { Avatar } from '../Avatar/Avatar';
import { ChevronRight } from '../../assets/Icon/icons';

interface CellProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: React.ReactNode;
  leftAccessory?: React.ReactNode;
  rightAccessory?: React.ReactNode;
  hasLeftAccessory?: boolean;
  hasRightAccessory?: boolean;
  titleColor?: string;
  subtitleColor?: string;
  descriptionColor?: string;
  className?: string;
  onClick?: () => void;
}

export const Cell: React.FC<CellProps> = ({
  title,
  subtitle,
  description,
  leftAccessory,
  rightAccessory,
  hasLeftAccessory = true,
  hasRightAccessory = true,
  titleColor = 'var(--primitive-primary)',
  subtitleColor = 'var(--primitive-secondary)',
  descriptionColor = 'var(--primitive-secondary)',
  className = '',
  onClick,
}) => {
  const defaultLeftAccessory = (
    <Avatar
      size="m"
      shape="circle"
      label="AA"
      style={{
        '--avatar-surface': 'var(--bg-neutral-2)',
        '--avatar-color': 'var(--primitive-secondary)',
      } as React.CSSProperties}
    />
  );

  const defaultRightAccessory = (
    <span className="ds-cell__default-icon" aria-hidden="true">
      <ChevronRight />
    </span>
  );

  return (
    <div
      className={`ds-cell ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {hasLeftAccessory && (
        <div className="ds-cell__left-accessory">
          {leftAccessory || defaultLeftAccessory}
        </div>
      )}

      <div className="ds-cell__content">
        {subtitle && (
          <div className="ds-cell__subtitle" style={{ color: subtitleColor }}>
            {subtitle}
          </div>
        )}
        <div className="ds-cell__title" style={{ color: titleColor }}>
          {title}
        </div>
        {description && (
          <div className="ds-cell__description" style={{ color: descriptionColor }}>
            {description}
          </div>
        )}
      </div>

      {hasRightAccessory && (
        <div className="ds-cell__right-accessory">
          {rightAccessory || defaultRightAccessory}
        </div>
      )}
    </div>
  );
};
