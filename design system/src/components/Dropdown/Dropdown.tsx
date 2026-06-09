import React, { useState } from 'react';
import { QuestionCircle } from '../../assets/Icon/icons';
import { ChevronDown } from '../../assets/Icon/12/Filled';
import './dropdown.css';

interface DropdownOption {
    value: string;
    label: string;
    isDisabled?: boolean;
}

interface DropdownProps {
    label?: string;
    description?: string;
    errorMessage?: string;
    value?: string;
    onChange?: (value: string) => void;
    options: DropdownOption[];
    isDisabled?: boolean;
    isError?: boolean;
    placeholder?: string;
    right?: React.ReactNode;
    hasChevron?: boolean;
    hasHelpIcon?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
    label,
    description,
    errorMessage,
    value,
    onChange,
    options,
    isDisabled = false,
    isError = false,
    placeholder = 'Select option',
    right,
    hasChevron = true,
    hasHelpIcon = true,
}) => {
    const [internalValue, setInternalValue] = useState('');
    const currentValue = value ?? internalValue;
    const selectedOption = options.find(opt => opt.value === currentValue);
    const displayValue = selectedOption ? selectedOption.label : placeholder;
    const metaText = isError ? errorMessage ?? description : description;

    const classNames = [
        'dropdown',
        isDisabled ? 'dropdown--disabled' : '',
        isError ? 'dropdown--error' : '',
    ].filter(Boolean).join(' ');

    return (
        <label className={classNames}>
            <div className="dropdown__content">
                <div className="dropdown__main">
                    <div className="dropdown__header">
                        {label && <p className="dropdown__title">{label}</p>}
                        {label && hasHelpIcon && (
                            <span className="dropdown__help ds-icon hoverOpacity" aria-hidden="true">
                                <QuestionCircle />
                            </span>
                        )}
                    </div>
                    <p className={`dropdown__value ${!selectedOption ? 'is-placeholder' : ''}`}>
                        {displayValue}
                    </p>
                </div>
                <div className="dropdown__accessory">
                    <span className="dropdown__accessory-stack">
                        {right}
                        {hasChevron && (
                            <span className="dropdown__chevron" aria-hidden="true">
                                <ChevronDown />
                            </span>
                        )}
                    </span>
                </div>
                <select
                    className="dropdown__native"
                    value={currentValue}
                    onChange={(e) => {
                        const nextValue = e.target.value;
                        if (value === undefined) {
                            setInternalValue(nextValue);
                        }
                        onChange?.(nextValue);
                        e.target.blur();
                    }}
                    disabled={isDisabled}
                >
                    <option value="" disabled>{placeholder}</option>
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value} disabled={opt.isDisabled}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
            {metaText && (
                <div className="dropdown__meta">
                    <div className="dropdown__divider"></div>
                    <p className="dropdown__description">{metaText}</p>
                </div>
            )}
        </label>
    );
};
