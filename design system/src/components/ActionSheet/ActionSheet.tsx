import React, { useEffect } from 'react';
import './action-sheet.css';

interface ActionSheetProps {
  isOpen: boolean;
  onClose?: () => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  isOverlayCloseEnabled?: boolean;
}

export const ActionSheet: React.FC<ActionSheetProps> = ({
  isOpen,
  onClose,
  header,
  footer,
  children,
  className = '',
  isOverlayCloseEnabled = true,
}) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const rootClassName = ['action-sheet', className].filter(Boolean).join(' ');

  return (
    <div className={rootClassName}>
      <button
        type="button"
        className="action-sheet__overlay"
        aria-label="Закрыть action sheet"
        onClick={() => {
          if (isOverlayCloseEnabled) {
            onClose?.();
          }
        }}
      />
      <aside className="action-sheet__panel" role="dialog" aria-modal="true">
        {header && <div className="action-sheet__header">{header}</div>}
        <div className="action-sheet__content">
          <div className="action-sheet__content-inner">{children}</div>
        </div>
        {footer && <div className="action-sheet__footer">{footer}</div>}
      </aside>
    </div>
  );
};
