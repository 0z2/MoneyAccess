import React from 'react';
import './modal-header.css';
import { ArrowLeft, Cross } from '../../assets/Icon/icons';

interface ModalHeaderProps {
  title?: React.ReactNode;
  leftAccessory?: React.ReactNode;
  hasDefaultBackArrow?: boolean;
  onLeftAccessoryClick?: () => void;
  onClose?: () => void;
  className?: string;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  leftAccessory,
  hasDefaultBackArrow = false,
  onLeftAccessoryClick,
  onClose,
  className = '',
}) => {
  const classNames = ['modal-header', className].filter(Boolean).join(' ');
  const resolvedLeftAccessory = leftAccessory ?? (
    hasDefaultBackArrow ? (
      <span className="modal-header__icon ds-icon ds-icon--24" aria-hidden="true">
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
      return <div className="modal-header__side modal-header__side--empty" />;
    }

    if (onClick) {
      return (
        <button
          type="button"
          className="modal-header__side modal-header__control hoverOpacity"
          onClick={onClick}
          aria-label={ariaLabel}
        >
          {content}
        </button>
      );
    }

    return <div className="modal-header__side">{content}</div>;
  };

  return (
    <div className={classNames}>
      <div className="modal-header__navigation">
        {renderSideSlot(resolvedLeftAccessory, onLeftAccessoryClick, 'Открыть предыдущее действие')}

        <div className="modal-header__center">
          {typeof title === 'undefined' ? null : (
            <div className="modal-header__title modal-header__title--compact">{title}</div>
          )}
        </div>

        {renderSideSlot(
          <span className="modal-header__icon ds-icon ds-icon--24" aria-hidden="true">
            <Cross />
          </span>,
          onClose,
          'Закрыть модальное окно',
        )}
      </div>

      {typeof title === 'undefined' ? null : (
        <div className="modal-header__title-block">
          <div className="modal-header__title modal-header__title--default">{title}</div>
        </div>
      )}
    </div>
  );
};
