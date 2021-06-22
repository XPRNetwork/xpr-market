import { useEffect, useState } from 'react';
import {
  ImageStyled,
  BlockedImage,
  NSFWButton,
  DefaultImage,
} from './NSFWImageWrapper.styled';
import { getRandomNumberInRange } from '../../utils';
import { getCachedMetadataByHash, MetadataResult } from '../../services/upload';
import { ReactComponent as DefaultIcon } from '../../public/placeholder-template-icon.svg';

type Props = {
  src: string;
  height?: string;
  width?: string;
  alt: string;
  imageStyling: React.ElementType;
  onLoad?: () => void;
  onError?: (e) => void;
  onClick?: () => void;
  ipfsHash?: string;
};

const NSFWImageWrapper = ({
  src,
  imageStyling: Image,
  ipfsHash,
  onLoad,
  ...props
}: Props): JSX.Element => {
  const [isNSFW, setIsNSFW] = useState<boolean>(null);
  const [blurImageNumber, setBlurImageNumber] = useState<number>(1);

  useEffect(() => {
    (async () => {
      let isNSFWUpdate = false;
      if (ipfsHash) {
        const metaResult: MetadataResult = await getCachedMetadataByHash(
          ipfsHash
        );
        if (Object.keys(metaResult).length > 0 && metaResult.nsfw) {
          metaResult.nsfw.forEach((type) => {
            if (
              (type.className === 'Hentai' ||
                type.className === 'Porn' ||
                type.className === 'Sexy') &&
              type.probability > 0.3
            ) {
              setBlurImageNumber(getRandomNumberInRange(1, 4));
              isNSFWUpdate = true;
            }
          });
        }
      }
      setIsNSFW(isNSFWUpdate);
      onLoad();
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

  if (isNSFW === false) {
    return <Image src={src} {...props} />;
  }

  if (!src || isNSFW === null) {
    return (
      <DefaultImage>
        <DefaultIcon />
      </DefaultImage>
    );
  }
};

export default NSFWImageWrapper;

NSFWImageWrapper.defaultProps = {
  imageStyling: ImageStyled,
};
