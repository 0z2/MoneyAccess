import React, { useEffect, useRef, useState } from 'react';
import './modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  isOverlayCloseEnabled?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  header,
  footer,
  children,
  className = '',
  isOverlayCloseEnabled = true,
}) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);

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

  useEffect(() => {
    if (!isOpen) {
      setIsHeaderCompact(false);
      return;
    }

    const node = contentRef.current;

    if (!node) {
      return;
    }

    const updateScrollState = () => {
      setIsHeaderCompact(node.scrollTop > 0);
    };

    updateScrollState();
    node.addEventListener('scroll', updateScrollState);

    return () => {
      node.removeEventListener('scroll', updateScrollState);
    };
  }, [isOpen, children]);

  if (!isOpen) {
    return null;
  }

  const rootClassName = ['modal', className].filter(Boolean).join(' ');
  const headerClassName = [
    'modal__header',
    isHeaderCompact ? 'modal__header--compact' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={rootClassName}>
      <button
        type="button"
        className="modal__overlay"
        aria-label="Закрыть модальное окно"
        onClick={() => {
          if (isOverlayCloseEnabled) {
            onClose?.();
          }
        }}
      />
      <aside className="modal__panel" role="dialog" aria-modal="true">
        {header && <div className={headerClassName}>{header}</div>}
        <div ref={contentRef} className="modal__content">
          <div className="modal__content-inner">{children}</div>
        </div>
        {footer && <div className="modal__footer">{footer}</div>}
      </aside>
    </div>
  );
};
