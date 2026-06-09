import React from 'react';
import { Button } from '../Button/Button';
import './promo-page-horizontal-card.css';

export type PromoPageHorizontalCardVariant = 'default' | 'accent';

export interface PromoPageHorizontalCardProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  buttonLabel?: React.ReactNode;
  image?: React.ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  variant?: PromoPageHorizontalCardVariant;
  hasDescription?: boolean;
  hasButton?: boolean;
  onButtonClick?: () => void;
  className?: string;
}

const DefaultImage = () => (
  <span className="promo-page-horizontal-card__default-image" aria-hidden="true" />
);

export const PromoPageHorizontalCard: React.FC<PromoPageHorizontalCardProps> = ({
  title = 'Text 2XL',
  description = 'Text L',
  buttonLabel = 'Text L',
  image,
  imageSrc,
  imageAlt = '',
  variant = 'default',
  hasDescription = true,
  hasButton = true,
  onButtonClick,
  className = '',
}) => {
  const isAccent = variant === 'accent';
  const classNames = [
    'promo-page-horizontal-card',
    isAccent && 'promo-page-horizontal-card--accent',
    className,
  ].filter(Boolean).join(' ');

  const imageContent = imageSrc
    ? <img className="promo-page-horizontal-card__image-img" src={imageSrc} alt={imageAlt} />
    : image || <DefaultImage />;

  return (
    <article className={classNames}>
      <div className="promo-page-horizontal-card__content">
        <div className="promo-page-horizontal-card__text">
          <h3 className="promo-page-horizontal-card__title ts-600-2xl">{title}</h3>
          {hasDescription && description && (
            <p className="promo-page-horizontal-card__description ts-500-l">{description}</p>
          )}
        </div>
        {isAccent && hasButton && (
          <Button
            className="promo-page-horizontal-card__button"
            variant="primary"
            onClick={onButtonClick}
          >
            {buttonLabel}
          </Button>
        )}
      </div>
      <div className="promo-page-horizontal-card__image">
        {imageContent}
      </div>
    </article>
  );
};
