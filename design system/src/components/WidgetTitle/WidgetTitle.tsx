import React from 'react';
import {
  ChevronRight,
  Circle,
  LinesThreeHorizontalWide,
  MinusCircle,
} from '../../assets/Icon/icons';
import { Badge } from '../Badge/Badge';
import './widget-title.css';

export type WidgetTitleAccessoryVariant =
  | 'icon'
  | 'link'
  | 'link-icon'
  | 'icon-icon'
  | 'description'
  | 'editing-mode'
  | 'none'
  | 'custom';

export interface WidgetTitleAccessoryProps {
  variant?: WidgetTitleAccessoryVariant;
  className?: string;
  content?: React.ReactNode;
  text?: React.ReactNode;
  icon?: React.ReactNode;
  secondaryIcon?: React.ReactNode;
  onClick?: () => void;
}

export interface WidgetTitleProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  hasDescription?: boolean;
  hasChevron?: boolean;
  hasRightAccessory?: boolean;
  chevron?: React.ReactNode;
  rightAccessory?: React.ReactNode;
  rightAccessoryVariant?: WidgetTitleAccessoryVariant;
  rightAccessoryText?: React.ReactNode;
  rightAccessoryIcon?: React.ReactNode;
  rightAccessorySecondaryIcon?: React.ReactNode;
  onRightAccessoryClick?: () => void;
}

const renderWidgetTitleAccessoryIcon = (
  icon: React.ReactNode,
  sizeClass = 'ds-icon--m'
) => (
  <span className={`ds-icon ${sizeClass} widget-title-accessory__icon`} aria-hidden="true">
    {icon}
  </span>
);

export const WidgetTitleAccessory: React.FC<WidgetTitleAccessoryProps> = ({
  variant = 'icon',
  className = '',
  content,
  text = variant === 'description' ? 'Text S' : 'Text M',
  icon = <Circle />,
  secondaryIcon = <MinusCircle />,
  onClick,
}) => {
  const classNames = ['widget-title-accessory', `widget-title-accessory--${variant}`, className]
    .filter(Boolean)
    .join(' ');

  if (content) {
    return <div className={classNames}>{content}</div>;
  }

  if (variant === 'custom') {
    return null;
  }

  const isInteractive =
    variant === 'icon' ||
    variant === 'link' ||
    variant === 'link-icon' ||
    variant === 'icon-icon' ||
    variant === 'editing-mode';

  const Component = isInteractive ? 'button' : 'div';

  return (
    <Component
      className={`${classNames} ${isInteractive ? 'hoverOpacity' : ''}`.trim()}
      type={Component === 'button' ? 'button' : undefined}
      onClick={isInteractive ? onClick : undefined}
    >
      {(variant === 'link' || variant === 'link-icon' || variant === 'description') && (
        <span
          className={
            variant === 'description'
              ? 'widget-title-accessory__description'
              : 'widget-title-accessory__link'
          }
        >
          {text}
        </span>
      )}

      {(variant === 'icon' || variant === 'link-icon' || variant === 'icon-icon') && (
        renderWidgetTitleAccessoryIcon(icon)
      )}

      {variant === 'icon-icon' && renderWidgetTitleAccessoryIcon(secondaryIcon)}

      {variant === 'editing-mode' && (
        <>
          {renderWidgetTitleAccessoryIcon(<LinesThreeHorizontalWide />, 'ds-icon--18')}
          {renderWidgetTitleAccessoryIcon(secondaryIcon)}
        </>
      )}

      {variant === 'none' && (
        <Badge value={0} color="transparent" textColor="transparent" className="widget-title-accessory__none" />
      )}
    </Component>
  );
};

export const WidgetTitle: React.FC<WidgetTitleProps> = ({
  title,
  description,
  className = '',
  hasDescription = true,
  hasChevron = true,
  hasRightAccessory = true,
  chevron = <ChevronRight />,
  rightAccessory,
  rightAccessoryVariant = 'icon',
  rightAccessoryText,
  rightAccessoryIcon,
  rightAccessorySecondaryIcon,
  onRightAccessoryClick,
}) => {
  const shouldRenderDescription = Boolean(description) && hasDescription;

  return (
    <div className={`widget-title ${className}`}>
      <div className="widget-title__header">
        <div className="widget-title__main hoverOpacity">
          <h3 className="widget-title__title">{title}</h3>
          {hasChevron && (
            <span className="ds-icon ds-icon--18 widget-title__chevron" aria-hidden="true">
              {chevron}
            </span>
          )}
        </div>

        {hasRightAccessory && (
          rightAccessory ?? (
            <WidgetTitleAccessory
              variant={rightAccessoryVariant}
              text={rightAccessoryText}
              icon={rightAccessoryIcon}
              secondaryIcon={rightAccessorySecondaryIcon}
              onClick={onRightAccessoryClick}
            />
          )
        )}
      </div>

      {shouldRenderDescription && <p className="widget-title__description">{description}</p>}
    </div>
  );
};
