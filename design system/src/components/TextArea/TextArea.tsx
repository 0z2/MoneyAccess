import React, { useRef, useEffect } from 'react';
import { QuestionCircle } from '../../assets/Icon/icons';
import './text-area.css';

interface TextAreaProps {
    label?: string;
    description?: string;
    errorMessage?: string;
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    isDisabled?: boolean;
    isError?: boolean;
    maxLength?: number;
}

export const TextArea: React.FC<TextAreaProps> = ({
    label,
    description,
    errorMessage,
    placeholder,
    value = '',
    onChange,
    isDisabled = false,
    isError = false,
    maxLength,
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const metaText = isError ? errorMessage ?? description : description;

    const autoResize = () => {
        const field = textareaRef.current;
        if (!field) return;
        field.style.height = 'auto';
        field.style.height = `${field.scrollHeight}px`;
    };

    useEffect(() => {
        autoResize();
    }, [value]);

    const classNames = [
        'text-area',
        isDisabled ? 'text-area--disabled' : '',
        isError ? 'text-area--error' : '',
    ].filter(Boolean).join(' ');

    return (
        <label className={classNames}>
            <div className="text-area__content">
                <div className="text-area__main">
                    <div className="text-area__header">
                        <div className="text-area__header-main">
                            {label && <p className="text-area__title">{label}</p>}
                            {label && (
                                <span className="text-area__help ds-icon hoverOpacity" aria-hidden="true">
                                    <QuestionCircle />
                                </span>
                            )}
                        </div>
                        {maxLength && (
                            <p className="text-area__counter">
                                {value.length}/{maxLength}
                            </p>
                        )}
                    </div>
                    <textarea
                        ref={textareaRef}
                        className="text-area__field"
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange?.(e.target.value)}
                        disabled={isDisabled}
                        maxLength={maxLength}
                    />
                </div>
            </div>
            {metaText && (
                <div className="text-area__meta">
                    <div className="text-area__divider"></div>
                    <p className="text-area__description">{metaText}</p>
                </div>
            )}
        </label>
    );
};
