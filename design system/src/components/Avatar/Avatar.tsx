import React from 'react';
import './avatar.css';

interface AvatarProps {
    label?: string;
    imageUrl?: string;
    icon?: React.ReactNode;
    size?: '2xl' | 'xl' | 'l' | 'm' | 's' | 'xs' | '2xs' | 16 | 24 | 32 | 40 | 48 | 56 | 64 | 72 | 80 | 120;
    shape?: 'circle' | 'superellipse' | 'square';
    className?: string;
    style?: React.CSSProperties;
}

export const Avatar: React.FC<AvatarProps> = ({
    label,
    imageUrl,
    icon,
    size = 'm',
    shape = 'superellipse',
    className = '',
    style,
}) => {
    const sizeClass = `avatar--${size}`;

    const classNames = [
        'avatar',
        sizeClass,
        `avatar--${shape}`,
        imageUrl && 'avatar--image',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={classNames} style={style}>
            {imageUrl ? (
                <img src={imageUrl} alt={label || 'Avatar'} className="avatar__image" />
            ) : icon ? (
                <span className="ds-icon avatar__icon">{icon}</span>
            ) : (
                <span className="avatar__label">{label}</span>
            )}
        </div>
    );
};
