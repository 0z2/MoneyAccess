import React from 'react';
import { Checkmark, Minus } from '../../assets/Icon/icons';
import './checkbox.css';

interface CheckboxProps {
    isChecked?: boolean;
    isIndeterminate?: boolean;
    isDisabled?: boolean;
    onChange?: (checked: boolean) => void;
    label?: string;
    style?: React.CSSProperties;
}

export const Checkbox: React.FC<CheckboxProps> = ({
    isChecked = false,
    isIndeterminate = false,
    isDisabled = false,
    onChange,
    label,
    style,
}) => {
    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!isDisabled && onChange) {
            onChange(!isChecked);
        }
    };

    const classNames = [
        'checkbox',
        isChecked ? 'is-checked' : '',
        isIndeterminate ? 'is-indeterminate' : '',
        isDisabled ? 'is-disabled' : '',
    ].filter(Boolean).join(' ');

    return (
        <button
            className={classNames}
            type="button"
            role="checkbox"
            aria-checked={isIndeterminate ? 'mixed' : isChecked}
            aria-label={label}
            disabled={isDisabled}
            onClick={handleToggle}
            style={style}
        >
            <span className="checkbox__icon checkbox__icon--check" aria-hidden="true">
                <Checkmark />
            </span>
            <span className="checkbox__icon checkbox__icon--minus" aria-hidden="true">
                <Minus />
            </span>
        </button>
    );
};
