import React from 'react';

interface ActionSheetHeaderProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  hasContent?: boolean;
  className?: string;
}

export const ActionSheetHeader: React.FC<ActionSheetHeaderProps> = ({
  title,
  description,
  hasContent = true,
  className = '',
}) => {
  const classNames = [
    'action-sheet-header',
    !hasContent ? 'action-sheet-header--empty' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames}>
      {hasContent && (
        <div className="action-sheet-header__content">
          {typeof title !== 'undefined' ? (
            <div className="action-sheet-header__title ts-400-m">{title}</div>
          ) : null}
        </div>
      )}
    </div>
  );
};
