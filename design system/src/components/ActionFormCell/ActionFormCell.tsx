import React from 'react';
import './action-form-cell.css';

interface ActionFormCellProps {
    title: string;
    description?: string;
    left?: React.ReactNode;
    right?: React.ReactNode;
    variant?: 'single' | 'stack-top' | 'stack-middle' | 'stack-bottom';
    onClick?: () => void;
    isDisabled?: boolean;
}

export const ActionFormCell: React.FC<ActionFormCellProps> = ({
    title,
    description,
    left,
    right,
    variant = 'single',
    onClick,
    isDisabled = false,
}) => {
    const classNames = [
        'action-form-cell',
        `action-form-cell--${variant}`,
        !description ? 'action-form-cell--single-line' : '',
        !right ? 'action-form-cell--no-spinner' : '',
        isDisabled ? 'is-disabled' : '',
    ].filter(Boolean).join(' ');

    return (
        <button className={classNames} type="button" onClick={onClick} disabled={isDisabled}>
            <div className="action-form-cell__content">
                <div className="action-form-cell__main">
                    {left && <div className="action-form-cell__left">{left}</div>}
                    <div className={`action-form-cell__text ${description ? 'action-form-cell__text--dual' : ''}`}>
                        <p className="action-form-cell__title">{title}</p>
                        {description && <p className="action-form-cell__description">{description}</p>}
                    </div>
                </div>
                {right && <div className="action-form-cell__right">{right}</div>}
            </div>
        </button>
    );
};
