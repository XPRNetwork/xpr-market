import Image from 'next/image';
import { ImageContainer, DefaultImage } from './TemplateImage.styled';

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
    <ImageContainer>
      {templateImgSrc ? (
        <Image
          priority
          layout="responsive"
          width={220}
          height={220}
          objectFit="contain"
          alt={templateName}
          src={templateImgSrc}
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
