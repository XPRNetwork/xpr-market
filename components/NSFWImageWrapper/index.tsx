import { useEffect, useState } from 'react';
import {
  ImageStyled,
  BlockedImage,
  NSFWButton,
} from './NSFWImageWrapper.styled';
import { getRandomNumberInRange } from '../../utils';

type Props = {
  src: string;
  height?: string;
  width?: string;
  alt: string;
  imageStyling: React.ElementType;
  onLoad?: (e) => void;
  onError?: (e) => void;
  onClick?: (e) => void;
};

const NSFWImageWrapper = ({
  src,
  imageStyling: Image,
  ...props
}: Props): JSX.Element => {
  const [isNSFW, setIsNSFW] = useState<boolean>(null);
  const [blurImageNumber, setBlurImageNumber] = useState<number>(1);

  if (isNSFW) {
    return (
      <BlockedImage
        onClick={(e) => {
          e.stopPropagation();
          setIsNSFW(false);
        }}
        {...props}
        blurImage={blurImageNumber}>
        <NSFWButton>Click to see NSFW</NSFWButton>
      </BlockedImage>
    );
  }

  if (isNSFW === false || src.includes('placeholder')) {
    return <Image src={src} {...props} />;
  }

  return <Image style={{ display: 'none' }} src={src} {...props} />;
};

export default NSFWImageWrapper;

NSFWImageWrapper.defaultProps = {
  imageStyling: ImageStyled,
};
