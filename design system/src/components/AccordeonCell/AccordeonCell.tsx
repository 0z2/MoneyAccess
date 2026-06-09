import React, { useState } from 'react';
import './accordeon-cell.css';
import { ChevronDown } from '../../assets/Icon/24/Stroked';
import { CellRightAccessory } from '../CellRightAccessory/CellRightAccessory';
import type { CellRightAccessoryVariant } from '../CellRightAccessory/CellRightAccessory';

export type AccordeonCellSize = 'xl' | '2xl';
export type AccordeonCellChevronPosition = 'title' | 'edge';
export type AccordeonCellSpacing = '0' | '0-5x' | '1x' | '2x' | '4x' | '6x';

export interface AccordeonCellProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  size?: AccordeonCellSize;
  chevronPosition?: AccordeonCellChevronPosition;
  hasDescription?: boolean;
  hasRightAccessory?: boolean;
  rightAccessory?: React.ReactNode;
  rightAccessoryVariant?: CellRightAccessoryVariant;
  rightAccessoryText?: string;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  contentSpacing?: AccordeonCellSpacing;
  listSpacing?: AccordeonCellSpacing;
  className?: string;
}

const spacingClassByValue: Record<AccordeonCellSpacing, string> = {
  '0': 'accordeon-cell--content-spacing-0',
  '0-5x': 'accordeon-cell--content-spacing-0-5x',
  '1x': 'accordeon-cell--content-spacing-1x',
  '2x': 'accordeon-cell--content-spacing-2x',
  '4x': 'accordeon-cell--content-spacing-4x',
  '6x': 'accordeon-cell--content-spacing-6x',
};

const listSpacingClassByValue: Record<AccordeonCellSpacing, string> = {
  '0': 'accordeon-cell--list-spacing-0',
  '0-5x': 'accordeon-cell--list-spacing-0-5x',
  '1x': 'accordeon-cell--list-spacing-1x',
  '2x': 'accordeon-cell--list-spacing-2x',
  '4x': 'accordeon-cell--list-spacing-4x',
  '6x': 'accordeon-cell--list-spacing-6x',
};

export const AccordeonCell: React.FC<AccordeonCellProps> = ({
  title,
  description,
  children,
  size = 'xl',
  chevronPosition = 'title',
  hasDescription = true,
  hasRightAccessory = true,
  rightAccessory,
  rightAccessoryVariant = 'text-m',
  rightAccessoryText = 'Text M',
  defaultOpen = false,
  isOpen,
  onOpenChange,
  contentSpacing = '4x',
  listSpacing = '2x',
  className = '',
}) => {
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const isExpanded = isOpen ?? innerOpen;
  const shouldRenderDescription = hasDescription && Boolean(description);
  const hasContent = Boolean(children);

  const handleToggle = () => {
    const nextOpen = !isExpanded;

    if (isOpen === undefined) {
      setInnerOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);
  };

  const rootClassName = [
    'accordeon-cell',
    `accordeon-cell--${size}`,
    `accordeon-cell--chevron-${chevronPosition}`,
    spacingClassByValue[contentSpacing],
    listSpacingClassByValue[listSpacing],
    isExpanded ? 'is-open' : '',
    shouldRenderDescription ? 'accordeon-cell--with-description' : '',
    className,
  ].filter(Boolean).join(' ');

  const defaultRightAccessory = (
    <CellRightAccessory variant={rightAccessoryVariant} text={rightAccessoryText} />
  );

  return (
    <div className={rootClassName}>
      <button
        className="accordeon-cell__header"
        type="button"
        aria-expanded={isExpanded}
        onClick={handleToggle}
      >
        <span className="accordeon-cell__center">
          <span className="accordeon-cell__content-row">
            <span className="accordeon-cell__title">{title}</span>
            <span className="accordeon-cell__chevron" aria-hidden="true">
              <ChevronDown />
            </span>
          </span>
          {shouldRenderDescription && (
            <span className="accordeon-cell__description">{description}</span>
          )}
        </span>
        {hasRightAccessory && chevronPosition === 'title' && (
          <span className="accordeon-cell__right-accessory">
            {rightAccessory ?? defaultRightAccessory}
          </span>
        )}
      </button>
      {hasContent && isExpanded && (
        <div className="accordeon-cell__body">
          <div className="accordeon-cell__list">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};
