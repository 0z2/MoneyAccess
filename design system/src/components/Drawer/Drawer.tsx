import React, { useEffect } from 'react';
import './drawer.css';

interface DrawerProps {
  isOpen: boolean;
  onClose?: () => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  header,
  footer,
  children,
  className = '',
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

  const rootClassName = ['drawer', className].filter(Boolean).join(' ');

  return (
    <div className={rootClassName}>
      <div className="drawer__overlay" aria-hidden="true" />
      <aside className="drawer__panel" role="dialog" aria-modal="true">
        {header && <div className="drawer__header">{header}</div>}
        <div className="drawer__content">{children}</div>
        {footer && <div className="drawer__footer">{footer}</div>}
      </aside>
    </div>
  );
};
