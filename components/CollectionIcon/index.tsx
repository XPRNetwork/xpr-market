import Image from 'next/image';
import { IconContainer } from './CollectionIcon.styled';
import { IPFS_RESOLVER } from '../../utils/constants';
export { IconContainer } from './CollectionIcon.styled';

type Props = {
  name: string;
  image?: string;
  margin?: string;
  width?: string;
};

const CollectionIcon = ({ name, image, margin, width }: Props): JSX.Element => {
  const imageSrc = image
    ? image.slice(0, 4).toLowerCase() !== 'data'
      ? `${IPFS_RESOLVER}${image}`
      : image
    : '/icon-monsters.png';
  return (
    <IconContainer margin={margin} width={width}>
      <Image priority layout="fill" alt={name} src={imageSrc} />
    </IconContainer>
  );
};

CollectionIcon.defaultProps = {
  name: 'collection icon',
};

export default CollectionIcon;
