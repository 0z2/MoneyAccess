import React from 'react';
import './drawer-header-title.css';

interface DrawerHeaderTitleProps {
  children: React.ReactNode;
  variant?: 'text-m' | 'text-l';
  className?: string;
}

export const DrawerHeaderTitle: React.FC<DrawerHeaderTitleProps> = ({
  children,
  variant = 'text-m',
  className = '',
}) => {
  const classNames = [
    'drawer-header-title',
    `drawer-header-title--${variant}`,
    className,
  ].filter(Boolean).join(' ');

  return <div className={classNames}>{children}</div>;
};
