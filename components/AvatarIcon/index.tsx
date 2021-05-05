import { Image } from '../../styles/index.styled';
import { AvatarImage } from './AvatarIcon.styled';

type AvatarIconProps = {
  avatar: string;
  size: string;
};

const AvatarIcon = ({ avatar, size }: AvatarIconProps): JSX.Element => {
  return (
    <AvatarImage size={size}>
      <Image
        width={size || '32px'}
        height={size || '32px'}
        alt="avatar"
        src={
          avatar ? `data:image/jpeg;base64,${avatar}` : '/default-avatar.png'
        }
      />
    </AvatarImage>
  );
};

export default AvatarIcon;
