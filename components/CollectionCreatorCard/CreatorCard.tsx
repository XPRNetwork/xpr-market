import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Card,
  Blur,
  BlurContainer,
  Title,
  BottomSection,
  IconContainer,
  PurpleName,
} from './CollectionCreatorCard.styled';
import { Image } from '../../styles/index.styled';
import { SearchAuthor } from '../../services/search';

type Props = {
  cardContent: SearchAuthor;
};

const CreatorCard = ({ cardContent }: Props): JSX.Element => {
  const router = useRouter();
  const { acc, avatar, name } = cardContent;

  const openUsersPage = () => {
    router.push(`/user/${name}`);
  };

  return (
    <Card onClick={openUsersPage}>
      <BlurContainer>
        <Blur img={avatar || ''} />
      </BlurContainer>
      <BottomSection height="184px">
        <IconContainer>
          <Image
            width="88px"
            height="88px"
            src={avatar || '/default-avatar.png'}
            alt={name}
          />
        </IconContainer>
        <Title>{name || acc}</Title>
        <PurpleName>@{acc}</PurpleName>
      </BottomSection>
    </Card>
  );
};

export default CreatorCard;
