import Image from 'next/image';
import { IconContainer, PlaceholderIcon } from './CollectionIcon.styled';
import { IPFS_RESOLVER } from '../../utils/constants';

type Props = {
  name: string;
  image?: string;
  margin?: string;
  width?: string;
};

const CollectionIcon = ({ name, image, margin, width }: Props): JSX.Element => {
  const imageSrc =
    image && image.slice(0, 4).toLowerCase() !== 'data'
      ? `${IPFS_RESOLVER}${image}`
      : image;
  return image ? (
    <IconContainer margin={margin} width={width}>
      <Image priority layout="fill" alt={name} src={imageSrc} />
    </IconContainer>
  ) : (
    <PlaceholderIcon aria-hidden margin={margin} width={width} />
  );
};

export default CollectionIcon;
