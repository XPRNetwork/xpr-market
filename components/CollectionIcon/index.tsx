import { IconContainer } from './CollectionIcon.styled';
import { IPFS_RESOLVER_IMAGE } from '../../utils/constants';
import { Image } from '../../styles/index.styled';
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
      ? `${IPFS_RESOLVER_IMAGE}${image}`
      : image
    : '/icon-monsters.png';
  return (
    <IconContainer margin={margin} width={width}>
      <Image alt={name} src={imageSrc} height="100%" width="100%" />
    </IconContainer>
  );
};

CollectionIcon.defaultProps = {
  name: 'collection icon',
};

export default CollectionIcon;
