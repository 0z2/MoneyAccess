import React from 'react';
import { Spinner } from '../Spinner/Spinner';
import './header-button.css';

interface HeaderButtonProps {
    children: React.ReactNode;
    icon?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
    isDisabled?: boolean;
    isLoading?: boolean;
    onClick?: () => void;
}

export const HeaderButton: React.FC<HeaderButtonProps> = ({
    children,
    icon,
    variant = 'primary',
    isDisabled = false,
    isLoading = false,
    onClick,
}) => {
    const classNames = [
        'header-button',
        `header-button--${variant}`,
        isDisabled ? 'is-disabled' : '',
        isLoading ? 'is-loading' : '',
    ].filter(Boolean).join(' ');

    return (
        <button
            className={classNames}
            type="button"
            disabled={isDisabled || isLoading}
            onClick={onClick}
        >
            {isLoading && <Spinner className="header-button__spinner" />}
            {icon && <span className="ds-icon ds-icon--m header-button__icon">{icon}</span>}
            <span className="header-button__label ts-500-s">{children}</span>
        </button>
    );
};
