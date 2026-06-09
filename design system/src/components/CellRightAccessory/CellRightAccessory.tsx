import React from 'react';
import './cell-right-accessory.css';
import { Avatar } from '../Avatar/Avatar';
import { Checkbox } from '../Checkbox/Checkbox';
import { Radio } from '../Radio/Radio';
import { Switch } from '../Switch/Switch';
import { Spinner } from '../Spinner/Spinner';
import { Badge } from '../Badge/Badge';
import { ChevronRight, Circle, Minus, Plus } from '../../assets/Icon/icons';

export type CellRightAccessoryVariant =
  | 'avatar-m'
  | 'avatar-s'
  | 'icon-30'
  | 'icon-24'
  | 'icon-18'
  | 'spinner-34-avatar-s'
  | 'spinner-24'
  | 'checkbox'
  | 'radio'
  | 'switch'
  | 'disclosure'
  | 'text-l-disclosure'
  | 'text-s-disclosure'
  | 'badge-disclosure'
  | 'badge'
  | 'notification-indicator'
  | 'text-l'
  | 'text-m'
  | 'text-s'
  | 'text-m-text-xs'
  | 'table-text-m-text-m'
  | 'table-text-s-text-s'
  | 'icon-24-icon-24'
  | 'text-m-icon-30'
  | 'text-m-icon-24'
  | 'text-m-icon-18'
  | 'stepper'
  | 'custom';

interface CellRightAccessoryProps {
  variant?: CellRightAccessoryVariant;
  className?: string;
  content?: React.ReactNode;
  icon?: React.ReactNode;
  secondaryIcon?: React.ReactNode;
  text?: string;
  secondaryText?: string;
  value?: number;
  isChecked?: boolean;
  isDisabled?: boolean;
  avatarLabel?: string;
  onCheckedChange?: (next: boolean) => void;
  onStep?: (delta: number) => void;
}

const renderIconNode = (node?: React.ReactNode) => node ?? <Circle />;

export const CellRightAccessory: React.FC<CellRightAccessoryProps> = ({
  variant = 'disclosure',
  className = '',
  content,
  icon,
  secondaryIcon,
  text = 'Text',
  secondaryText = 'Text XS',
  value = 0,
  isChecked = false,
  isDisabled = false,
  avatarLabel = 'AA',
  onCheckedChange,
  onStep,
}) => {
  const rootClassName = ['ds-cell-right-accessory', className].filter(Boolean).join(' ');

  if (content) {
    return <div className={rootClassName}>{content}</div>;
  }

  switch (variant) {
    case 'disclosure':
      return (
        <div className={rootClassName}>
          <span className="ds-cell-right-accessory__disclosure" aria-hidden="true">
            <ChevronRight />
          </span>
        </div>
      );

    case 'checkbox':
      return (
        <div className={rootClassName}>
          <Checkbox
            isChecked={isChecked}
            isDisabled={isDisabled}
            onChange={onCheckedChange}
            label="Checkbox"
          />
        </div>
      );

    case 'radio':
      return (
        <div className={rootClassName}>
          <Radio
            isSelected={isChecked}
            isDisabled={isDisabled}
            onChange={isDisabled ? undefined : () => onCheckedChange?.(!isChecked)}
            label="Radio"
          />
        </div>
      );

    case 'switch':
      return (
        <div className={rootClassName}>
          <Switch
            isSelected={isChecked}
            isDisabled={isDisabled}
            onChange={onCheckedChange}
            label="Switch"
          />
        </div>
      );

    case 'icon-30':
    case 'icon-24':
    case 'icon-18': {
      const sizeClass = `ds-cell-right-accessory__icon--${variant.split('-')[1]}`;
      return (
        <div className={rootClassName}>
          <span className={`ds-cell-right-accessory__icon ${sizeClass}`} aria-hidden="true">
            {renderIconNode(icon)}
          </span>
        </div>
      );
    }

    case 'spinner-24':
      return (
        <div className={rootClassName}>
          <Spinner />
        </div>
      );

    case 'spinner-34-avatar-s':
      return (
        <div className={rootClassName}>
          <div className="ds-cell-right-accessory__row">
            <span className="ds-cell-right-accessory__spinner-large">
              <Spinner className="ds-cell-right-accessory__spinner-large-inner" />
            </span>
            <Avatar size="s" shape="circle" label={avatarLabel} />
          </div>
        </div>
      );

    case 'avatar-m':
      return (
        <div className={rootClassName}>
          <Avatar size="m" shape="circle" label={avatarLabel} />
        </div>
      );

    case 'avatar-s':
      return (
        <div className={rootClassName}>
          <Avatar size="s" shape="circle" label={avatarLabel} />
        </div>
      );

    case 'text-l':
    case 'text-m':
    case 'text-s': {
      const textClass = `ds-cell-right-accessory__${variant}`;
      return (
        <div className={rootClassName}>
          <span className={textClass}>{text}</span>
        </div>
      );
    }

    case 'text-m-text-xs':
    case 'table-text-m-text-m':
    case 'table-text-s-text-s':
      return (
        <div className={rootClassName}>
          <div className="ds-cell-right-accessory__stack">
            <span
              className={
                variant === 'table-text-s-text-s'
                  ? 'ds-cell-right-accessory__text-s-muted'
                  : 'ds-cell-right-accessory__text-m-primary'
              }
            >
              {text}
            </span>
            <span
              className={
                variant === 'text-m-text-xs'
                  ? 'ds-cell-right-accessory__text-xs-secondary'
                  : variant === 'table-text-m-text-m'
                    ? 'ds-cell-right-accessory__text-m-strong'
                    : 'ds-cell-right-accessory__text-s'
              }
            >
              {secondaryText}
            </span>
          </div>
        </div>
      );

    case 'text-l-disclosure':
    case 'text-s-disclosure':
      return (
        <div className={rootClassName}>
          <div className="ds-cell-right-accessory__row">
            <span
              className={
                variant === 'text-l-disclosure'
                  ? 'ds-cell-right-accessory__text-l'
                  : 'ds-cell-right-accessory__text-s'
              }
            >
              {text}
            </span>
            <span className="ds-cell-right-accessory__disclosure" aria-hidden="true">
              <ChevronRight />
            </span>
          </div>
        </div>
      );

    case 'badge':
      return (
        <div className={rootClassName}>
          <Badge value={value} />
        </div>
      );

    case 'badge-disclosure':
      return (
        <div className={rootClassName}>
          <div className="ds-cell-right-accessory__row">
            <Badge value={value} />
            <span className="ds-cell-right-accessory__disclosure" aria-hidden="true">
              <ChevronRight />
            </span>
          </div>
        </div>
      );

    case 'notification-indicator':
      return (
        <div className={rootClassName}>
          <span className="ds-cell-right-accessory__notification-indicator" aria-hidden="true" />
        </div>
      );

    case 'icon-24-icon-24':
      return (
        <div className={rootClassName}>
          <div className="ds-cell-right-accessory__row">
            <span className="ds-cell-right-accessory__icon ds-cell-right-accessory__icon--24" aria-hidden="true">
              {renderIconNode(icon)}
            </span>
            <span className="ds-cell-right-accessory__icon ds-cell-right-accessory__icon--24" aria-hidden="true">
              {renderIconNode(secondaryIcon)}
            </span>
          </div>
        </div>
      );

    case 'text-m-icon-30':
    case 'text-m-icon-24':
    case 'text-m-icon-18': {
      const sizeClass = `ds-cell-right-accessory__icon--${variant.split('-').pop()}`;
      return (
        <div className={rootClassName}>
          <div className="ds-cell-right-accessory__row">
            <span className="ds-cell-right-accessory__text-m">{text}</span>
            <span className={`ds-cell-right-accessory__icon ${sizeClass}`} aria-hidden="true">
              {renderIconNode(icon)}
            </span>
          </div>
        </div>
      );
    }

    case 'stepper':
      return (
        <div className={rootClassName}>
          <div className="ds-cell-right-accessory__stepper">
            <button
              type="button"
              className="ds-cell-right-accessory__stepper-button"
              onClick={() => onStep?.(-1)}
              disabled={isDisabled}
              aria-label="Decrease"
            >
              <Minus />
            </button>
            <Badge value={value} />
            <button
              type="button"
              className="ds-cell-right-accessory__stepper-button"
              onClick={() => onStep?.(1)}
              disabled={isDisabled}
              aria-label="Increase"
            >
              <Plus />
            </button>
          </div>
        </div>
      );

    case 'custom':
    default:
      return <div className={rootClassName} />;
  }
};
