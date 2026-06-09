import React from 'react';
import './radio.css';

interface RadioProps {
    isSelected?: boolean;
    isDisabled?: boolean;
    onChange?: () => void;
    label?: string;
}

export const Radio: React.FC<RadioProps> = ({
    isSelected = false,
    isDisabled = false,
    onChange,
    label,
}) => {
    const classNames = [
        'radio',
        isSelected ? 'is-selected' : '',
        isDisabled ? 'is-disabled' : '',
    ].filter(Boolean).join(' ');

    return (
        <button
            className={classNames}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={label}
            disabled={isDisabled}
            onClick={!isDisabled ? onChange : undefined}
        />
    );
};
