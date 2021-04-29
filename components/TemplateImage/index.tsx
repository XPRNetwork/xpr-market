import { ImageContainer, DefaultImage, Image } from './TemplateImage.styled';

type Props = {
  templateImgSrc?: string;
  fallbackImgSrc?: string;
  templateName: string;
  priceTag?: JSX.Element;
  resize?: boolean;
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
  if (!templateImgSrc) {
    return <DefaultImage src={fallbackImgSrc} alt={templateName} />;
  }

  return (
    <Image
      src={templateImgSrc}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = fallbackImgSrc;
      }}
    />
  );
};

const TemplateImage = ({
  templateName,
  templateImgSrc,
  priceTag,
  fallbackImgSrc = '/placeholder-template-image.png',
}: Props): JSX.Element => {
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
