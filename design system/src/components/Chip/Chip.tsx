import React from 'react';
import { Circle } from '../../assets/Icon/icons';
import { ChevronDown } from '../../assets/Icon/12/Filled';
import { Badge } from '../Badge/Badge';
import './chip.css';

interface ChipProps {
    children: React.ReactNode;
    variant?: 'chip' | 'tab' | 'dropdown' | 'action';
    isSelected?: boolean;
    isDisabled?: boolean;
    onClick?: () => void;
    onClose?: (e: React.MouseEvent) => void;
    leftAccessory?: 'icon' | 'logo' | 'logo-stack';
    leftIcon?: React.ReactNode;
    badge?: number | string;
    isOpen?: boolean;
    className?: string;
}

export const Chip: React.FC<ChipProps> = ({
    children,
    variant = 'chip',
    isSelected = false,
    isDisabled = false,
    onClick,
    onClose,
    leftAccessory,
    leftIcon,
    badge,
    isOpen = false,
    className = '',
}) => {
    const classNames = [
        'chip',
        `chip--${variant}`,
        isSelected ? 'is-selected' : '',
        isDisabled ? 'is-disabled' : '',
        isOpen ? 'is-pressed' : '',
        className
    ].filter(Boolean).join(' ');

    const renderLeftAccessory = () => {
        if (!leftAccessory) return null;

        if (leftAccessory === 'icon') {
            return (
                <span className="chip__accessory chip__accessory--left ds-icon ds-icon--xs" aria-hidden="true">
                    {leftIcon ?? <Circle />}
                </span>
            );
        }

        if (leftAccessory === 'logo') {
            return (
                <span className="chip__accessory chip__accessory--left" aria-hidden="true">
                    <span className="chip__logo"></span>
                </span>
            );
        }

        if (leftAccessory === 'logo-stack') {
            return (
                <span className="chip__accessory chip__accessory--left chip__logo-stack" aria-hidden="true">
                    <span className="chip__logo"></span>
                    <span className="chip__logo"></span>
                </span>
            );
        }

        return null;
    };

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onClose) onClose(e);
    };

    const content = (
        <>
            {renderLeftAccessory()}
            <span className="chip__label ts-500-s">{children}</span>
            {variant === 'tab' && badge !== undefined && (
                <span className="chip__accessory chip__accessory--right chip__badge" aria-hidden="true">
                    <Badge value={Number(badge)} size="s" />
                </span>
            )}
            {variant === 'dropdown' && (
                <span className={`chip__accessory chip__caret ${isOpen ? 'is-open' : ''}`} aria-hidden="true">
                    <ChevronDown />
                </span>
            )}
            {variant === 'action' && isSelected && (
                <span className="chip__accessory chip__cross" aria-hidden="true" onClick={handleClose} />
            )}
        </>
    );

    if (variant === 'dropdown') {
        return (
            <button className={classNames} type="button" disabled={isDisabled} onClick={onClick}>
                <span className="chip__dropdown">
                    {content}
                </span>
            </button>
        );
    }

    return (
        <button
            className={classNames}
            type="button"
            disabled={isDisabled}
            onClick={onClick}
        >
            {content}
        </button>
    );
};
