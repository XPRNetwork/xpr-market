import { useState, useRef } from 'react';
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
import ShareOnSocial from '../ShareOnSocial';
import { useClickAway } from '../../hooks';
import { IPFS_RESOLVER } from '../../utils/constants';

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
  const [shareActive, setShareActive] = useState<boolean>(false);
  const shareRef = useRef(null);
  useClickAway(shareRef, () => setShareActive(false));

  const avatarImg = image
    ? `data:image/jpeg;base64,${image}`
    : '/default-avatar.png';
  const collectionImg = image
    ? `${IPFS_RESOLVER}${image}`
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
      <IconButton ref={shareRef} onClick={() => setShareActive(!shareActive)}>
        <MoreIcon />
        <ShareOnSocial top={'50px'} active={shareActive} />
      </IconButton>
    </PageHeaderContainer>
  );
};

export default PageHeader;
