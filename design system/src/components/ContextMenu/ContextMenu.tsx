import React, { useEffect, useRef } from 'react';
import './context-menu.css';

export interface ContextMenuItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'default' | 'danger';
  onClick?: () => void;
  isDisabled?: boolean;
}

export interface ContextMenuProps {
  trigger: React.ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  placement?: 'right' | 'left';
  items: ContextMenuItem[];
  className?: string;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  trigger,
  isOpen,
  onClose,
  placement = 'right',
  items,
  className = '',
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (!rootRef.current?.contains(target)) {
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [isOpen, onClose]);

  const rootClassName = ['context-menu-anchor', className].filter(Boolean).join(' ');
  const panelClassName = ['context-menu', `context-menu--${placement}`].join(' ');

  return (
    <div ref={rootRef} className={rootClassName}>
      {trigger}
      {isOpen && (
        <div className={panelClassName}>
          <div className="context-menu__list">
            {items.map((item) => {
              const itemClassName = [
                'context-menu__item',
                'hoverOpacity',
                `context-menu__item--${item.variant ?? 'default'}`,
                item.isDisabled ? 'is-disabled' : '',
              ].filter(Boolean).join(' ');

              return (
                <button
                  key={item.key}
                  type="button"
                  className={itemClassName}
                  disabled={item.isDisabled}
                  onClick={() => {
                    if (item.isDisabled) {
                      return;
                    }

                    item.onClick?.();
                    onClose?.();
                  }}
                >
                  {item.icon && (
                    <span className="context-menu__icon ds-icon ds-icon--m" aria-hidden="true">
                      {item.icon}
                    </span>
                  )}
                  <span className="context-menu__label ts-500-m">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
