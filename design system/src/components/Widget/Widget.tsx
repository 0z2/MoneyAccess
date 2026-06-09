import React from 'react';
import { WidgetTitle, WidgetTitleProps } from '../WidgetTitle/WidgetTitle';
import './widget.css';

export interface WidgetProps extends Omit<WidgetTitleProps, 'className'> {
  children?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  minContentHeight?: number | string;
}

export const Widget: React.FC<WidgetProps> = ({
  children,
  className = '',
  contentClassName = '',
  minContentHeight = 146,
  ...titleProps
}) => {
  const contentStyle = typeof minContentHeight === 'number'
    ? { minHeight: `${minContentHeight}px` }
    : { minHeight: minContentHeight };

  return (
    <section className={`widget ${className}`}>
      <WidgetTitle {...titleProps} />
      <div className={`widget__content ${contentClassName}`} style={contentStyle}>
        {children}
      </div>
    </section>
  );
};
