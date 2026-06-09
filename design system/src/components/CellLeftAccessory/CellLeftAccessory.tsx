import React from 'react';
import './cell-left-accessory.css';
import { Avatar } from '../Avatar/Avatar';
import { Circle } from '../../assets/Icon/icons';

export type CellLeftAccessoryVariant =
  | 'avatar'
  | 'icon-30'
  | 'icon-24'
  | 'icon-18'
  | 'card-preview'
  | 'avatar-checkbox'
  | 'add-button'
  | 'custom';

interface CellLeftAccessoryProps {
  variant?: CellLeftAccessoryVariant;
  className?: string;
  content?: React.ReactNode;
  icon?: React.ReactNode;
  avatarLabel?: string;
  isChecked?: boolean;
  onClick?: () => void;
}

export const CellLeftAccessory: React.FC<CellLeftAccessoryProps> = ({
  variant = 'avatar',
  className = '',
  content,
  icon,
  avatarLabel = 'AA',
  isChecked = false,
  onClick,
}) => {
  const rootClassName = ['ds-cell-left-accessory', className].filter(Boolean).join(' ');

  if (content) {
    return <div className={rootClassName}>{content}</div>;
  }

  switch (variant) {
    case 'avatar':
      return (
        <div className={rootClassName}>
          <Avatar size="m" shape="circle" label={avatarLabel} />
        </div>
      );

    case 'icon-30':
    case 'icon-24':
    case 'icon-18': {
      const sizeClass = `ds-cell-left-accessory__icon--${variant.split('-')[1]}`;
      return (
        <div className={rootClassName}>
          <span className={`ds-cell-left-accessory__icon ${sizeClass}`} aria-hidden="true">
            {icon ?? <Circle />}
          </span>
        </div>
      );
    }

    case 'card-preview':
      return (
        <div className={rootClassName}>
          <span className="ds-cell-left-accessory__card-preview" aria-hidden="true" />
        </div>
      );

    case 'avatar-checkbox':
      return (
        <div className={rootClassName}>
          <span className="ds-cell-left-accessory__avatar-checkbox" aria-hidden="true">
            <span
              className={`ds-cell-left-accessory__avatar-checkbox-indicator${isChecked ? ' is-checked' : ''}`}
            />
          </span>
        </div>
      );

    case 'add-button':
      return (
        <div className={rootClassName}>
          <button
            type="button"
            className="ds-cell-left-accessory__add-button"
            onClick={onClick}
            aria-label="Add"
          >
            <span className="ds-cell-left-accessory__add-icon" aria-hidden="true">
              {icon ?? <Circle />}
            </span>
          </button>
        </div>
      );

    case 'custom':
    default:
      return <div className={rootClassName} />;
  }
};
