import React from 'react';
import './page-action.css';

interface PageActionProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  leftAccessory?: React.ReactNode;
  variant?: 'default' | 'danger';
  hasDescription?: boolean;
  className?: string;
  onClick?: () => void;
  isDisabled?: boolean;
}

export const PageAction: React.FC<PageActionProps> = ({
  title,
  description,
  leftAccessory,
  variant = 'default',
  hasDescription = true,
  className = '',
  onClick,
  isDisabled = false,
}) => {
  const classNames = [
    'page-action',
    `page-action--${variant}`,
    !description || !hasDescription ? 'page-action--single-line' : '',
    isDisabled ? 'is-disabled' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classNames}
      type="button"
      onClick={onClick}
      disabled={isDisabled}
    >
      {leftAccessory && (
        <div className="page-action__left" aria-hidden="true">
          {leftAccessory}
        </div>
      )}
      <div className="page-action__text">
        <p className="page-action__title">{title}</p>
        {description && hasDescription && (
          <p className="page-action__description">{description}</p>
        )}
      </div>
    </button>
  );
};
