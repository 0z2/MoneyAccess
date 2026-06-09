import React from 'react';
import './spinner.css';

interface SpinnerProps {
    className?: string;
    style?: React.CSSProperties;
}

export const Spinner: React.FC<SpinnerProps> = ({ className = '', style }) => {
    return (
        <span className={`ds-spinner ${className}`} style={style} aria-hidden="true">
            <span className="ds-spinner__ring"></span>
        </span>
    );
};
