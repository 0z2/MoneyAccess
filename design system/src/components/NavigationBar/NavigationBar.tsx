import React from 'react';
import { ArrowLeft, Broom, ChevronRight } from '../../assets/Icon/icons';
import { Badge } from '../Badge/Badge';
import { LinearProgress } from '../LinearProgress/LinearProgress';
import './navigation-bar.css';

type NavigationBarItemKey = string | number;

interface NavigationBarBaseItem {
  key?: NavigationBarItemKey;
  label: React.ReactNode;
}

export interface NavigationBarLinkItem extends NavigationBarBaseItem {
  kind: 'link';
  href?: string;
  onClick?: () => void;
  isDisabled?: boolean;
}

export interface NavigationBarStepItem extends NavigationBarBaseItem {
  kind: 'step';
  state?: 'current' | 'upcoming';
}

export type NavigationBarItem = NavigationBarLinkItem | NavigationBarStepItem;

export interface NavigationBarLegacyProps {
  isAdaptive?: false;
  title: React.ReactNode;
  description?: React.ReactNode;
  rootLinkLabel?: React.ReactNode;
  items?: NavigationBarItem[];
  className?: string;
  hasBackButton?: boolean;
  hasActionButton?: boolean;
  hasRootLink?: boolean;
  hasDescription?: boolean;
  backButtonLabel?: string;
  actionButtonLabel?: string;
  backButtonIcon?: React.ReactNode;
  actionButtonIcon?: React.ReactNode;
  onBackClick?: () => void;
  onActionClick?: () => void;
  onRootLinkClick?: () => void;
}

export interface NavigationBarAdaptiveProgress {
  value: number;
  maxSteps?: number;
  ariaLabel?: string;
}

export interface NavigationBarAdaptiveProps {
  isAdaptive: true;
  isInverted?: boolean;
  titleVariant?: 'none' | 'title' | 'title-description' | 'step-progress' | 'percent-progress' | 'image';
  title?: React.ReactNode;
  description?: React.ReactNode;
  logo?: React.ReactNode;
  progress?: NavigationBarAdaptiveProgress;
  className?: string;
  leftIcon?: React.ReactNode;
  leftAriaLabel?: string;
  onLeftClick?: () => void;
  rightAccessoryVariant?: 'none' | 'icon' | 'icon-icon' | 'icon-badge' | 'action';
  rightIcon?: React.ReactNode;
  secondaryRightIcon?: React.ReactNode;
  rightAriaLabel?: string;
  secondaryRightAriaLabel?: string;
  onRightClick?: () => void;
  onSecondaryRightClick?: () => void;
  actionLabel?: React.ReactNode;
  badgeValue?: number;
}

export type NavigationBarProps = NavigationBarLegacyProps | NavigationBarAdaptiveProps;

const renderNavigationBarActionButton = (
  icon: React.ReactNode,
  ariaLabel: string,
  onClick?: () => void
) => (
  <button
    className="navigation-bar__button hoverOpacity"
    type="button"
    aria-label={ariaLabel}
    onClick={onClick}
  >
    <span className="ds-icon ds-icon--m" aria-hidden="true">
      {icon}
    </span>
  </button>
);

const isStepItem = (item: NavigationBarItem): item is NavigationBarStepItem => item.kind === 'step';

const renderAdaptiveIconButton = (
  icon: React.ReactNode,
  ariaLabel: string,
  onClick?: () => void,
  className = ''
) => (
  <button
    className={`navigation-bar-adaptive__icon-button hoverOpacity ${className}`}
    type="button"
    aria-label={ariaLabel}
    onClick={onClick}
  >
    <span className="ds-icon ds-icon--m" aria-hidden="true">
      {icon}
    </span>
  </button>
);

const renderAdaptiveTitle = ({
  titleVariant = 'title',
  title,
  description,
  logo,
  progress,
}: NavigationBarAdaptiveProps) => {
  if (titleVariant === 'none') {
    return <div className="navigation-bar-adaptive__title navigation-bar-adaptive__title--empty" aria-hidden="true" />;
  }

  if (titleVariant === 'image') {
    return (
      <div className="navigation-bar-adaptive__title navigation-bar-adaptive__title--image">
        {logo}
      </div>
    );
  }

  if (titleVariant === 'step-progress' || titleVariant === 'percent-progress') {
    const progressValue = progress?.value ?? 0;

    return (
      <div className="navigation-bar-adaptive__title navigation-bar-adaptive__title--progress">
        <LinearProgress
          variant={titleVariant === 'step-progress' ? 'steps' : 'percent'}
          value={progressValue}
          maxSteps={progress?.maxSteps}
          ariaLabel={progress?.ariaLabel}
        />
      </div>
    );
  }

  return (
    <div className={`navigation-bar-adaptive__title ${titleVariant === 'title-description' ? 'navigation-bar-adaptive__title--description' : ''}`}>
      {title && <div className="navigation-bar-adaptive__title-text">{title}</div>}
      {titleVariant === 'title-description' && description && (
        <div className="navigation-bar-adaptive__description">{description}</div>
      )}
    </div>
  );
};

const renderAdaptiveRightAccessories = ({
  rightAccessoryVariant = 'icon',
  rightIcon = <Broom />,
  secondaryRightIcon,
  rightAriaLabel = 'Action',
  secondaryRightAriaLabel = 'Secondary action',
  onRightClick,
  onSecondaryRightClick,
  actionLabel = 'Text M',
  badgeValue = 0,
}: NavigationBarAdaptiveProps) => {
  if (rightAccessoryVariant === 'none') {
    return <div className="navigation-bar-adaptive__right navigation-bar-adaptive__right--empty" aria-hidden="true" />;
  }

  if (rightAccessoryVariant === 'action') {
    return (
      <button
        className="navigation-bar-adaptive__action hoverOpacity"
        type="button"
        onClick={onRightClick}
      >
        {actionLabel}
      </button>
    );
  }

  if (rightAccessoryVariant === 'icon-icon') {
    return (
      <div className="navigation-bar-adaptive__right">
        {renderAdaptiveIconButton(rightIcon, rightAriaLabel, onRightClick)}
        {renderAdaptiveIconButton(secondaryRightIcon ?? rightIcon, secondaryRightAriaLabel, onSecondaryRightClick)}
      </div>
    );
  }

  if (rightAccessoryVariant === 'icon-badge') {
    return (
      <div className="navigation-bar-adaptive__right navigation-bar-adaptive__right--badge">
        <Badge value={badgeValue} size="s" />
        {renderAdaptiveIconButton(rightIcon, rightAriaLabel, onRightClick)}
      </div>
    );
  }

  return (
    <div className="navigation-bar-adaptive__right">
      {renderAdaptiveIconButton(rightIcon, rightAriaLabel, onRightClick)}
    </div>
  );
};

export const NavigationBar: React.FC<NavigationBarProps> = (props) => {
  if (props.isAdaptive) {
    const className = [
      'navigation-bar-adaptive',
      props.isInverted ? 'navigation-bar-adaptive--inverted' : '',
      props.className ?? '',
    ].filter(Boolean).join(' ');

    return (
      <section className={className}>
        <div className="navigation-bar-adaptive__left">
          {renderAdaptiveIconButton(
            props.leftIcon ?? <ArrowLeft />,
            props.leftAriaLabel ?? 'Go back',
            props.onLeftClick
          )}
        </div>

        {renderAdaptiveTitle(props)}
        {renderAdaptiveRightAccessories(props)}
      </section>
    );
  }

  const {
    title,
    description,
    rootLinkLabel,
    items = [],
    className = '',
    hasBackButton = true,
    hasActionButton = true,
    hasRootLink = true,
    hasDescription = true,
    backButtonLabel = 'Go back',
    actionButtonLabel = 'Clear',
    backButtonIcon = <ArrowLeft />,
    actionButtonIcon = <Broom />,
    onBackClick,
    onActionClick,
    onRootLinkClick,
  } = props;

  const hasItems = items.length > 0;
  const shouldRenderDescription = Boolean(description) && hasDescription;
  const shouldRenderRootLink = Boolean(rootLinkLabel) && hasRootLink;
  const isStepsMode = hasItems && items.every(isStepItem);

  return (
    <section className={`navigation-bar ${className}`}>
      {(hasBackButton || hasActionButton) && (
        <div className="navigation-bar__buttons">
          {hasBackButton && renderNavigationBarActionButton(backButtonIcon, backButtonLabel, onBackClick)}
          {hasActionButton && renderNavigationBarActionButton(actionButtonIcon, actionButtonLabel, onActionClick)}
        </div>
      )}

      <div className="navigation-bar__header">
        {shouldRenderRootLink && (
          <button
            className="navigation-bar__root-link hoverOpacity"
            type="button"
            onClick={onRootLinkClick}
          >
            <span className="navigation-bar__root-link-label">{rootLinkLabel}</span>
            <span className="ds-icon ds-icon--xs navigation-bar__root-link-icon" aria-hidden="true">
              <ChevronRight />
            </span>
          </button>
        )}

        <div className="navigation-bar__title-block">
          <h2 className="navigation-bar__title">{title}</h2>
          {shouldRenderDescription && (
            <p className="navigation-bar__description">{description}</p>
          )}
        </div>
      </div>

      {hasItems && (
        <div className="navigation-bar__items" role={isStepsMode ? 'list' : undefined}>
          {items.map((item, index) => {
            const itemKey = item.key ?? index;

            if (item.kind === 'step') {
              const isCurrent = item.state === 'current';

              return (
                <div
                  key={itemKey}
                  className={`navigation-bar__step ${isCurrent ? 'navigation-bar__step--current' : ''}`}
                  role="listitem"
                >
                  <span className="navigation-bar__step-indicator" aria-hidden="true" />
                  <span className="navigation-bar__step-label">{item.label}</span>
                </div>
              );
            }

            return (
              item.href ? (
                <a
                  key={itemKey}
                  className="navigation-bar__link hoverOpacity"
                  href={item.isDisabled ? undefined : item.href}
                  onClick={item.onClick}
                  aria-disabled={item.isDisabled || undefined}
                >
                  <span className="navigation-bar__link-label">{item.label}</span>
                </a>
              ) : (
                <button
                  key={itemKey}
                  className="navigation-bar__link hoverOpacity"
                  type="button"
                  onClick={item.onClick}
                  disabled={item.isDisabled}
                >
                  <span className="navigation-bar__link-label">{item.label}</span>
                </button>
              )
            );
          })}
        </div>
      )}
    </section>
  );
};
