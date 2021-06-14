import { useEffect, useState } from 'react';
import {
  ImageStyled,
  BlockedImage,
  NSFWButton,
} from './NSFWImageWrapper.styled';
import { getRandomNumberInRange } from '../../utils';
import { getCachedMetadataByHash } from '../../services/upload';

type Props = {
  src: string;
  height?: string;
  width?: string;
  alt: string;
  imageStyling: React.ElementType;
  onLoad?: (e) => void;
  onError?: (e) => void;
  onClick?: (e) => void;
  ipfsHash?: string;
};

type MetadataResult = {
  fileExtension?: string;
  ipfsHash?: string;
  nsfw?: { className: string; probability: number }[];
};

const NSFWImageWrapper = ({
  src,
  imageStyling: Image,
  ipfsHash,
  ...props
}: Props): JSX.Element => {
  const [isNSFW, setIsNSFW] = useState<boolean>(null);
  const [blurImageNumber, setBlurImageNumber] = useState<number>(1);

  useEffect(() => {
    (async () => {
      if (ipfsHash) {
        const metaResult: MetadataResult = await getCachedMetadataByHash(
          ipfsHash
        );
        if (Object.keys(metaResult).length > 0) {
          metaResult.nsfw.forEach((type) => {
            if (
              (type.className === 'Hentai' ||
                type.className === 'Porn' ||
                type.className === 'Sexy') &&
              type.probability > 0.00001
            ) {
              setBlurImageNumber(getRandomNumberInRange(1, 4));
              setIsNSFW(true);
            }
          });
        } else {
          setIsNSFW(false);
        }
      }
    })();
  }, [ipfsHash]);

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
