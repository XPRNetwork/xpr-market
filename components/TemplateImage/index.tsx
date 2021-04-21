import Image from 'next/image';
import { ImageContainer } from './TemplateImage.styled';

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
      <Image
        priority
        layout="responsive"
        width={220}
        height={220}
        objectFit="contain"
        alt={templateName}
        src={templateImgSrc || '/placeholder-template-image.png'}
      />
      {priceTag}
    </ImageContainer>
  );
};

export default TemplateImage;
