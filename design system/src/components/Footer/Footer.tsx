import React from 'react';
import './footer.css';

import { Button } from '../Button/Button';
import { Circle, Minus, Plus } from '../../icons';

export type FooterLayout =
  | '1-button'
  | '2-buttons-in-line'
  | '3-buttons'
  | 'page-control-button'
  | 'stepper-button';

export interface FooterAction {
  label: string;
  onClick?: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
}

export interface FooterIconAction {
  icon?: React.ReactNode;
  ariaLabel: string;
  onClick?: () => void;
  isDisabled?: boolean;
}

export interface FooterProps {
  layout?: FooterLayout;
  description?: React.ReactNode;
  primaryAction?: FooterAction;
  secondaryAction?: FooterAction;
  iconAction?: FooterIconAction;
  stepperValue?: React.ReactNode;
  onStepperDecrease?: () => void;
  onStepperIncrease?: () => void;
  isStepperDecreaseDisabled?: boolean;
  isStepperIncreaseDisabled?: boolean;
  pageControlCount?: number;
  pageControlValue?: number;
  onPageControlChange?: (index: number) => void;
  className?: string;
}

export interface FooterIconButtonProps {
  icon?: React.ReactNode;
  ariaLabel: string;
  onClick?: () => void;
  isDisabled?: boolean;
  className?: string;
}

const defaultPrimaryAction: FooterAction = { label: 'Действие' };
const defaultSecondaryAction: FooterAction = { label: 'Действие' };

const renderFooterButton = (
  action: FooterAction,
  variant: 'primary' | 'secondary',
  className = '',
) => (
  <Button
    variant={variant}
    isDisabled={action.isDisabled}
    isLoading={action.isLoading}
    onClick={action.onClick}
    className={['footer__button', className].filter(Boolean).join(' ')}
  >
    {action.label}
  </Button>
);

export const FooterIconButton: React.FC<FooterIconButtonProps> = ({
  icon = <Circle />,
  ariaLabel,
  onClick,
  isDisabled = false,
  className = '',
}) => (
  <button
    className={['footer-icon-button', className].filter(Boolean).join(' ')}
    type="button"
    aria-label={ariaLabel}
    disabled={isDisabled}
    onClick={onClick}
  >
    <span className="ds-icon ds-icon--m" aria-hidden="true">
      {icon}
    </span>
  </button>
);

export const Footer: React.FC<FooterProps> = ({
  layout = '1-button',
  description,
  primaryAction = defaultPrimaryAction,
  secondaryAction = defaultSecondaryAction,
  iconAction,
  stepperValue = '00',
  onStepperDecrease,
  onStepperIncrease,
  isStepperDecreaseDisabled = false,
  isStepperIncreaseDisabled = false,
  pageControlCount = 3,
  pageControlValue = 0,
  onPageControlChange,
  className = '',
}) => {
  const rootClassName = [
    'footer',
    `footer--${layout}`,
    ['1-button', '2-buttons-in-line', '3-buttons'].includes(layout) ? 'footer--with-description-slot' : '',
    className,
  ].filter(Boolean).join(' ');

  const hasDescriptionSlot = ['1-button', '2-buttons-in-line', '3-buttons'].includes(layout);
  const shouldShowDescription = hasDescriptionSlot && description;

  return (
    <footer className={rootClassName}>
      {shouldShowDescription && (
        <div className="footer__description ts-400-s">{description}</div>
      )}

      {layout === '1-button' && (
        <div className="footer__buttons footer__buttons--single">
          {renderFooterButton(primaryAction, 'primary')}
        </div>
      )}

      {layout === '2-buttons-in-line' && (
        <div className="footer__buttons footer__buttons--inline">
          {renderFooterButton(secondaryAction, 'secondary')}
          {renderFooterButton(primaryAction, 'primary')}
        </div>
      )}

      {layout === '3-buttons' && (
        <div className="footer__buttons footer__buttons--triple">
          <FooterIconButton
            ariaLabel={iconAction?.ariaLabel ?? 'Действие'}
            icon={iconAction?.icon}
            isDisabled={iconAction?.isDisabled}
            onClick={iconAction?.onClick}
          />
          {renderFooterButton(secondaryAction, 'secondary', 'footer__button--fluid')}
          {renderFooterButton(primaryAction, 'primary', 'footer__button--fluid')}
        </div>
      )}

      {layout === 'page-control-button' && (
        <>
          <div className="footer__page-control" role="tablist" aria-label="Страницы">
            {Array.from({ length: pageControlCount }, (_, index) => {
              const isSelected = index === pageControlValue;

              return (
                <button
                  className={[
                    'footer__page-dot',
                    isSelected ? 'footer__page-dot--selected' : '',
                  ].filter(Boolean).join(' ')}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-label={`Страница ${index + 1}`}
                  key={index}
                  onClick={() => onPageControlChange?.(index)}
                />
              );
            })}
          </div>
          <div className="footer__buttons footer__buttons--single">
            {renderFooterButton(primaryAction, 'primary')}
          </div>
        </>
      )}

      {layout === 'stepper-button' && (
        <div className="footer__buttons footer__buttons--stepper">
          <div className="footer__stepper" role="group" aria-label="Количество">
            <button
              className="footer__stepper-button"
              type="button"
              aria-label="Уменьшить"
              disabled={isStepperDecreaseDisabled}
              onClick={onStepperDecrease}
            >
              <span className="ds-icon ds-icon--m" aria-hidden="true">
                <Minus />
              </span>
            </button>
            <div className="footer__stepper-value ts-500-m">{stepperValue}</div>
            <button
              className="footer__stepper-button"
              type="button"
              aria-label="Увеличить"
              disabled={isStepperIncreaseDisabled}
              onClick={onStepperIncrease}
            >
              <span className="ds-icon ds-icon--m" aria-hidden="true">
                <Plus />
              </span>
            </button>
          </div>
          {renderFooterButton(primaryAction, 'primary')}
        </div>
      )}
    </footer>
  );
};
