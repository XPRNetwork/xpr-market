import { Image } from './AssetDisplay.styled';
import { IPFS_RESOLVER_IMAGE, RESIZER_IMAGE } from '../../utils/constants';

const AssetImage = ({
  image,
  templateName,
}: {
  image: string;
  templateName: string;
}): JSX.Element => {
  const onImageError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = `${IPFS_RESOLVER_IMAGE}${image}`;
  };

  return (
    <Image
      src={`${RESIZER_IMAGE}${IPFS_RESOLVER_IMAGE}${image}`}
      alt={templateName}
      onError={onImageError}
    />
  );
};

export default AssetImage;
