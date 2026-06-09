import React from 'react';
import { Spinner } from '../Spinner/Spinner';

interface ActionSheetButtonProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  hasDescription?: boolean;
  icon?: React.ReactNode;
  hasIcon?: boolean;
  variant?: 'default' | 'danger';
  isDisabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  className?: string;
}

export const ActionSheetButton: React.FC<ActionSheetButtonProps> = ({
  title,
  description,
  hasDescription = false,
  icon,
  hasIcon = true,
  variant = 'default',
  isDisabled = false,
  isLoading = false,
  onClick,
  className = '',
}) => {
  const shouldRenderDescription = hasDescription && typeof description !== 'undefined';
  const shouldRenderIcon = hasIcon && typeof icon !== 'undefined';
  const classNames = [
    'action-sheet-button',
    'hoverOpacity',
    `action-sheet-button--${variant}`,
    !shouldRenderDescription ? 'action-sheet-button--single-line' : '',
    isDisabled ? 'is-disabled' : '',
    isLoading ? 'is-loading' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={classNames}
      disabled={isDisabled || isLoading}
      onClick={onClick}
    >
      <div className="action-sheet-button__main">
        {shouldRenderIcon && (
          <span className="action-sheet-button__icon ds-icon ds-icon--30" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className="action-sheet-button__text">
          <span className="action-sheet-button__title">{title}</span>
          {shouldRenderDescription && <span className="action-sheet-button__description">{description}</span>}
        </span>
      </div>
      {isLoading && <Spinner className="action-sheet-button__spinner" />}
    </button>
  );
};
