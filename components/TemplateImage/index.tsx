import Image from 'next/image';
import { ReactComponent as AudioIcon } from '../../public/audio.svg';
import { ReactComponent as VideoIcon } from '../../public/video.svg';
import { ImageContainer, IconContainer } from './TemplateImage.styled';

type Props = {
  isAudio?: boolean;
  isVideo?: boolean;
  templateImgSrc?: string;
  templateName: string;
  priceTag?: JSX.Element;
};

const TemplateImage = ({
  isAudio,
  isVideo,
  templateName,
  templateImgSrc,
  priceTag,
}: Props): JSX.Element => {
  const getImageContent = () => {
    if (isAudio) {
      return (
        <IconContainer>
          <AudioIcon />
        </IconContainer>
      );
    } else if (isVideo) {
      return (
        <IconContainer>
          <VideoIcon />
        </IconContainer>
      );
    } else {
      return (
        <Image
          priority
          layout="responsive"
          width={213}
          height={220}
          alt={templateName}
          src={
            templateImgSrc ? templateImgSrc : '/placeholder-template-image.png'
          }
        />
      );
    }
  };

  return (
    <ImageContainer isAudio={isAudio} isVideo={isVideo}>
      {getImageContent()}
      {priceTag}
    </ImageContainer>
  );
};

export default TemplateImage;
