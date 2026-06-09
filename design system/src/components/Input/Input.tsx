import React from 'react';
import { QuestionCircle } from '../../assets/Icon/icons';
import './input.css';

interface InputProps {
    label?: string;
    description?: string;
    errorMessage?: string;
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    isDisabled?: boolean;
    isError?: boolean;
    left?: React.ReactNode;
    right?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
    label,
    description,
    errorMessage,
    placeholder,
    value,
    onChange,
    isDisabled = false,
    isError = false,
    left,
    right,
}) => {
    const metaText = isError ? errorMessage ?? description : description;

    const classNames = [
        'input',
        isDisabled ? 'input--disabled' : '',
        isError ? 'input--error' : '',
    ].filter(Boolean).join(' ');

    return (
        <label className={classNames}>
            <div className="input__content">
                {left && <div className="input__accessory">{left}</div>}
                <div className="input__main">
                    {label && (
                        <div className="input__header">
                            <p className="input__title">{label}</p>
                            <span className="input__help ds-icon hoverOpacity" aria-hidden="true">
                                <QuestionCircle />
                            </span>
                        </div>
                    )}
                    <input
                        className="input__field"
                        type="text"
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange?.(e.target.value)}
                        disabled={isDisabled}
                    />
                </div>
                {right && <div className="input__accessory">{right}</div>}
            </div>
            {metaText && (
                <div className="input__meta">
                    <div className="input__divider"></div>
                    <p className="input__description">{metaText}</p>
                </div>
            )}
        </label>
    );
};
