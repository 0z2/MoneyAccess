import React from 'react';
import './button.css';

import { Spinner } from '../Spinner/Spinner';

interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'transparent' | 'white';
    size?: 'l' | 'm' | 's'; // Assuming these sizes exist or will exist
    isLoading?: boolean;
    isDisabled?: boolean;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    isLoading = false,
    isDisabled = false,
    onClick,
    type = 'button',
    className = '',
}) => {
    const classNames = [
        'button',
        `button--${variant}`,
        isLoading ? 'is-loading' : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            className={classNames}
            type={type}
            disabled={isDisabled}
            onClick={onClick}
            aria-label={isLoading ? 'Загрузка' : undefined}
        >
            <span className="button__label ts-500-l">{children}</span>
            {isLoading && <Spinner />}
        </button>
    );
};
