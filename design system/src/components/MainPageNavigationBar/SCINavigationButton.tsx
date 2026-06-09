import React from 'react';

export interface SCINavigationButtonProps {
  isActive?: boolean;
  label: string;
  onClick?: () => void;
}

export const SCINavigationButton: React.FC<SCINavigationButtonProps> = ({
  isActive = false,
  label,
  onClick,
}) => {
  const className = [
    'sci-navigation-button',
    isActive ? 'sci-navigation-button--selected' : '',
  ].filter(Boolean).join(' ');

  return (
    <button
      className={className}
      type="button"
      aria-current={isActive ? 'page' : undefined}
      onClick={onClick}
    >
      <span className="sci-navigation-button__label ts-500-m">{label}</span>
    </button>
  );
};
