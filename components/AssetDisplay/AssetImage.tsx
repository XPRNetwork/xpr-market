import { SRLWrapper } from 'simple-react-lightbox';
import { useState } from 'react';
import { Image } from './AssetDisplay.styled';
import { IPFS_RESOLVER_IMAGE, RESIZER_IMAGE } from '../../utils/constants';

const AssetImage = ({
  image,
  templateName,
}: {
  image: string;
  templateName: string;
}): JSX.Element => {
  const [src, setSrc] = useState<string>(
    `${RESIZER_IMAGE}${IPFS_RESOLVER_IMAGE}${image}`
  );

  const onImageError = (e) => {
    e.currentTarget.onerror = null;
    setSrc(image ? `${IPFS_RESOLVER_IMAGE}${image}` : '');
  };

  const lightboxCallbacks = {
    onLightboxOpened: (_) => setSrc(`${IPFS_RESOLVER_IMAGE}${image}`),
    onLightboxClosed: (_) =>
      setSrc(`${RESIZER_IMAGE}${IPFS_RESOLVER_IMAGE}${image}`),
  };

  const lightboxOptions = {
    thumbnails: {
      showThumbnails: false,
    },
    buttons: {
      showDownloadButton: false,
      showThumbnailsButton: false,
      showAutoplayButton: false,
      showNextButton: false,
      showPrevButton: false,
    },
    settings: {
      overlayColor: 'rgba(0, 0, 0)',
      disablePanzoom: true,
    },
  };

  return (
    <SRLWrapper callbacks={lightboxCallbacks} options={lightboxOptions}>
      <Image src={src} alt={templateName} onError={onImageError} />
    </SRLWrapper>
  );
};

export default AssetImage;
