import React from 'react';
import './drawer-footer.css';
import { Button } from '../Button/Button';

export type DrawerFooterLayout = '1-button' | '2-buttons' | '2-horizontal-buttons' | 'empty';

interface DrawerFooterAction {
  label: string;
  onClick?: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  isSelected?: boolean;
}

interface DrawerFooterProps {
  layout?: DrawerFooterLayout;
  description?: React.ReactNode;
  primaryAction?: DrawerFooterAction;
  secondaryAction?: DrawerFooterAction;
  className?: string;
}

export const DrawerFooter: React.FC<DrawerFooterProps> = ({
  layout = '1-button',
  description,
  primaryAction,
  secondaryAction,
  className = '',
}) => {
  if (layout === 'empty') {
    return <div className={['drawer-footer', 'drawer-footer--empty', className].filter(Boolean).join(' ')} />;
  }

  const rootClassName = [
    'drawer-footer',
    layout === '2-horizontal-buttons' ? 'drawer-footer--row' : 'drawer-footer--column',
    className,
  ].filter(Boolean).join(' ');

  const buttonsClassName = [
    'drawer-footer__buttons',
    layout === '2-horizontal-buttons' ? 'drawer-footer__buttons--row' : 'drawer-footer__buttons--column',
  ].join(' ');

  return (
    <div className={rootClassName}>
      {description && <div className="drawer-footer__description">{description}</div>}

      <div className={buttonsClassName}>
        {secondaryAction && layout !== '1-button' && (
          <Button
            variant={secondaryAction.isSelected ? 'primary' : 'secondary'}
            isDisabled={secondaryAction.isDisabled}
            isLoading={secondaryAction.isLoading}
            onClick={secondaryAction.onClick}
            className="drawer-footer__button"
          >
            {secondaryAction.label}
          </Button>
        )}

        {primaryAction && (
          <Button
            variant={primaryAction.isSelected ? 'primary' : 'secondary'}
            isDisabled={primaryAction.isDisabled}
            isLoading={primaryAction.isLoading}
            onClick={primaryAction.onClick}
            className="drawer-footer__button"
          >
            {primaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
};
