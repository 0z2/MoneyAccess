import React from 'react';
import './form-cell.css';

interface FormCellProps {
    children?: React.ReactNode;
    title: string;
    subtitle?: string;
    description?: string;
    left?: React.ReactNode;
    right?: React.ReactNode;
    variant?: 'single' | 'stack-top' | 'stack-middle' | 'stack-bottom';
    className?: string;
}

export const FormCell: React.FC<FormCellProps> = ({
    children,
    title,
    subtitle,
    description,
    left,
    right,
    variant = 'single',
    className = '',
}) => {
    const classNames = [
        'form-cell',
        `form-cell--${variant}`,
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={classNames}>
            <div className="form-cell__content">
                <div className="form-cell__main">
                    {left && <div className="form-cell__left">{left}</div>}
                    <div className={`form-cell__text ${(subtitle || description) ? 'form-cell__text--dual' : ''}`}>
                        {subtitle && <p className="form-cell__subtitle">{subtitle}</p>}
                        <p className="form-cell__title">{title}</p>
                        {description && <p className="form-cell__description">{description}</p>}
                    </div>
                </div>
                {right && (
                    <div className="form-cell__right">
                        <div className="form-cell__control">
                            {right}
                        </div>
                    </div>
                )}
            </div>
            {children}
        </div>
    );
};
