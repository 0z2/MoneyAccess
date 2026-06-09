import React from 'react';
import './drawer-header.css';
import { ArrowLeft, Cross } from '../../assets/Icon/icons';
import { DrawerHeaderTitle } from './DrawerHeaderTitle';

interface DrawerHeaderProps {
  title?: React.ReactNode;
  titleVariant?: 'text-m' | 'text-l';
  leftAccessory?: React.ReactNode;
  hasDefaultBackArrow?: boolean;
  onLeftAccessoryClick?: () => void;
  onClose?: () => void;
  className?: string;
}

export const DrawerHeader: React.FC<DrawerHeaderProps> = ({
  title,
  titleVariant = 'text-m',
  leftAccessory,
  hasDefaultBackArrow = false,
  onLeftAccessoryClick,
  onClose,
  className = '',
}) => {
  const classNames = ['drawer-header', className].filter(Boolean).join(' ');
  const resolvedLeftAccessory = leftAccessory ?? (
    hasDefaultBackArrow ? (
      <span className="drawer-header__icon ds-icon ds-icon--24" aria-hidden="true">
        <ArrowLeft />
      </span>
    ) : null
  );

  const renderSideSlot = (
    content: React.ReactNode,
    onClick?: () => void,
    ariaLabel?: string,
  ) => {
    if (!content) {
      return <div className="drawer-header__side drawer-header__side--empty" />;
    }

    if (onClick) {
      return (
        <button
          type="button"
          className="drawer-header__side drawer-header__control hoverOpacity"
          onClick={onClick}
          aria-label={ariaLabel}
        >
          {content}
        </button>
      );
    }

    return <div className="drawer-header__side">{content}</div>;
  };

  return (
    <div className={classNames}>
      {renderSideSlot(resolvedLeftAccessory, onLeftAccessoryClick, 'Открыть предыдущее действие')}

      <div className="drawer-header__center">
        {typeof title === 'undefined' ? null : (
          <DrawerHeaderTitle variant={titleVariant}>{title}</DrawerHeaderTitle>
        )}
      </div>

      {renderSideSlot(
        onClose ? (
          <span className="drawer-header__icon ds-icon ds-icon--24" aria-hidden="true">
            <Cross />
          </span>
        ) : null,
        onClose,
        'Закрыть панель',
      )}
    </div>
  );
};
