import Image from 'next/image';
import { IconContainer, PlaceholderIcon } from './CollectionIcon.styled';
import { IPFS_RESOLVER } from '../../utils/constants';

type Props = {
  name: string;
  image?: string;
  margin?: string;
  width?: string;
};

const CollectionIcon = ({ name, image, margin, width }: Props): JSX.Element =>
  image ? (
    <IconContainer margin={margin} width={width}>
      <Image
        priority
        layout="fill"
        alt={name}
        src={`${IPFS_RESOLVER}${image}`}
      />
    </IconContainer>
  ) : (
    <PlaceholderIcon aria-hidden margin={margin} width={width} />
  );

export default CollectionIcon;
