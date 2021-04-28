import { ImageContainer, DefaultImage, Image } from './TemplateImage.styled';

type Props = {
  templateImgSrc?: string;
  templateName: string;
  priceTag?: JSX.Element;
};

const TemplateImage = ({
  templateName,
  templateImgSrc,
  priceTag,
}: Props): JSX.Element => {
  return (
    <ImageContainer className="template-image-container">
      {templateImgSrc ? (
        <Image src={templateImgSrc} />
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
