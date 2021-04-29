import { ImageContainer, DefaultImage, Image } from './TemplateImage.styled';

type Props = {
  templateImgSrc?: string;
  fallbackImgSrc?: string;
  templateName: string;
  priceTag?: JSX.Element;
};

const TemplateImage = ({
  templateName,
  fallbackImgSrc,
  templateImgSrc,
  priceTag,
}: Props): JSX.Element => {
  return (
    <ImageContainer className="template-image-container">
      {templateImgSrc ? (
        <Image
          src={templateImgSrc}
          onError={(e) => {
            e.currentTarget.onerror = null;
            if (fallbackImgSrc) {
              e.currentTarget.src = fallbackImgSrc;
            }
          }}
        />
      ) : (
        <DefaultImage
          src="/placeholder-template-image.png"
          alt={templateName}
        />
      )}
      {priceTag}
    </ImageContainer>
  );
};

export default TemplateImage;
