import React from 'react';
import { Button } from '../Button/Button';
import { NavigationBar } from '../NavigationBar/NavigationBar';
import './promo-page-banner.css';

export interface PromoPageBannerProps {
  title?: React.ReactNode;
  adaptiveTitle?: React.ReactNode;
  description?: React.ReactNode;
  adaptiveDescription?: React.ReactNode;
  buttonLabel?: React.ReactNode;
  image?: React.ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  hasImage?: boolean;
  hasDescription?: boolean;
  hasButton?: boolean;
  onButtonClick?: () => void;
  className?: string;
}

const DefaultImage = () => (
  <span className="promo-page-banner__default-image" aria-hidden="true" />
);

export const PromoPageBanner: React.FC<PromoPageBannerProps> = ({
  title = 'Text 5XL',
  adaptiveTitle = 'Text 3XL',
  description = 'Text XL',
  adaptiveDescription = 'Text M',
  buttonLabel = 'Text L',
  image,
  imageSrc,
  imageAlt = '',
  hasImage = true,
  hasDescription = true,
  hasButton = true,
  onButtonClick,
  className = '',
}) => {
  const classNames = [
    'promo-page-banner',
    !hasImage && 'promo-page-banner--without-image',
    className,
  ].filter(Boolean).join(' ');

  const imageContent = imageSrc
    ? <img className="promo-page-banner__image-img" src={imageSrc} alt={imageAlt} />
    : image || <DefaultImage />;

  return (
    <section className={classNames}>
      <NavigationBar
        isAdaptive
        isInverted
        className="promo-page-banner__navigation"
        titleVariant="none"
        rightAccessoryVariant="none"
      />
      <div className="promo-page-banner__content">
        {hasImage && (
          <div className="promo-page-banner__image">
            {imageContent}
          </div>
        )}
        <div className="promo-page-banner__info">
          <div className="promo-page-banner__text">
            <h2 className="promo-page-banner__title promo-page-banner__title--desktop ts-600-5xl">{title}</h2>
            <h2 className="promo-page-banner__title promo-page-banner__title--adaptive ts-600-3xl">{adaptiveTitle}</h2>
            {hasDescription && description && (
              <p className="promo-page-banner__description promo-page-banner__description--desktop ts-500-xl">{description}</p>
            )}
            {hasDescription && adaptiveDescription && (
              <p className="promo-page-banner__description promo-page-banner__description--adaptive ts-500-m">{adaptiveDescription}</p>
            )}
          </div>
          {hasButton && (
            <div className="promo-page-banner__button-block">
              <Button
                className="promo-page-banner__button"
                variant="white"
                onClick={onButtonClick}
              >
                {buttonLabel}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
