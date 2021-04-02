import Image from 'next/image';
import { IconContainer, PlaceholderIcon } from './CollectionIcon.styled';

type Props = {
  name: string;
  image?: string;
  margin?: string;
};

const CollectionIcon = ({ name, image, margin }: Props): JSX.Element =>
  image ? (
    <IconContainer margin={margin}>
      <Image priority layout="fill" alt={name} src={image} />
    </IconContainer>
  ) : (
    <PlaceholderIcon aria-hidden margin={margin} />
  );

export default CollectionIcon;
