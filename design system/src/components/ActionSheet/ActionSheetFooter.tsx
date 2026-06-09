import React from 'react';
import { Spinner } from '../Spinner/Spinner';

interface ActionSheetFooterProps {
  onClick?: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

export const ActionSheetFooter: React.FC<ActionSheetFooterProps> = ({
  onClick,
  isDisabled = false,
  isLoading = false,
  className = '',
}) => {
  const classNames = [
    'action-sheet-footer',
    'hoverOpacity',
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
      {isLoading && <Spinner className="action-sheet-footer__spinner" />}
      <span className="action-sheet-footer__label ts-500-l">Отмена</span>
    </button>
  );
};
