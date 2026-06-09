import React from 'react';
import './switch.css';

interface SwitchProps {
    isSelected?: boolean;
    isDisabled?: boolean;
    onChange?: (isSelected: boolean) => void;
    label?: string;
    style?: React.CSSProperties;
}

export const Switch: React.FC<SwitchProps> = ({
    isSelected = false,
    isDisabled = false,
    onChange,
    label,
    style,
}) => {
    const handleToggle = () => {
        if (!isDisabled && onChange) {
            onChange(!isSelected);
        }
    };

    const classNames = [
        'switch',
        isSelected ? 'is-selected' : '',
        isDisabled ? 'is-disabled' : '',
    ].filter(Boolean).join(' ');

    return (
        <button
            className={classNames}
            type="button"
            role="switch"
            aria-checked={isSelected}
            aria-label={label}
            disabled={isDisabled}
            onClick={handleToggle}
            style={style}
        />
    );
};
