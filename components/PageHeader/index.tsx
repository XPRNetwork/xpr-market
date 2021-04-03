import Image from 'next/image';
import {
  PageHeaderContainer,
  ImageContainer,
  IconButton,
  Name,
  SubName,
  Description,
} from './PageHeader.styled';
import { ReactComponent as MoreIcon } from '../../public/more.svg';

type PageHeaderProps = {
  image?: string;
  description?: string;
  name?: string;
  subName?: string;
  type: 'user' | 'collection';
};

const PageHeader = ({
  image,
  description,
  name,
  subName,
  type,
}: PageHeaderProps): JSX.Element => {
  const avatarImg = image
    ? `data:image/jpeg;base64,${image}`
    : '/default-avatar.png';
  const collectionImg = image
    ? `https://cloudflare-ipfs.com/ipfs/${image}`
    : '/proton.svg';
  const displayImg = type === 'user' ? avatarImg : collectionImg;
  const subNameIcon = type === 'user' ? '@' : '#';

  return (
    <PageHeaderContainer>
      <ImageContainer>
        <Image
          priority
          layout="responsive"
          width={120}
          height={120}
          src={displayImg}
        />
      </ImageContainer>
      <Name>{name}</Name>
      <SubName>
        {subNameIcon}
        {subName}
      </SubName>
      <Description>{description}</Description>
      <IconButton>
        <MoreIcon />
      </IconButton>
    </PageHeaderContainer>
  );
};

export default PageHeader;
