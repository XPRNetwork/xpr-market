import { useRef } from 'react';
import LazyLoad from 'react-lazyload';
import { ImageContainer, DefaultImage, Image } from './TemplateImage.styled';
import { PlaceholderAsset } from '../TemplateCard/TemplateCard.styled';

type Props = {
  templateImgSrc?: string;
  fallbackImgSrc?: string;
  templateName: string;
  priceTag?: JSX.Element;
};

const TemplateImageChild = ({
  templateName,
  templateImgSrc,
  fallbackImgSrc,
}: {
  templateName: string;
  templateImgSrc: string;
  fallbackImgSrc: string;
}): JSX.Element => {
  const refPlaceholder = useRef<HTMLDivElement>();

  const removePlaceholder = () => refPlaceholder.current.remove();

  if (!templateImgSrc) {
    return <DefaultImage src={fallbackImgSrc} alt={templateName} />;
  }

  return (
    <>
      <PlaceholderAsset ref={refPlaceholder} />
      <LazyLoad height="100%" offset={100} once>
        <Image
          src={templateImgSrc}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackImgSrc;
            removePlaceholder();
          }}
          onLoad={removePlaceholder}
        />
      </LazyLoad>
    </>
  );
};

const TemplateImage = ({
  templateName,
  templateImgSrc,
  priceTag,
  fallbackImgSrc,
}: Props): JSX.Element => {
  if (!fallbackImgSrc) {
    fallbackImgSrc = '/placeholder-template-image.png';
  }

  return (
    <ImageContainer className="template-image-container">
      <TemplateImageChild
        templateName={templateName}
        fallbackImgSrc={fallbackImgSrc}
        templateImgSrc={templateImgSrc}
      />
      {priceTag}
    </ImageContainer>
  );
};

export default TemplateImage;
