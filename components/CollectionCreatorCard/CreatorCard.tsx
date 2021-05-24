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
import { useBlacklistContext } from '../Provider';

type Props = {
  cardContent: SearchAuthor;
};

const CreatorCard = ({ cardContent }: Props): JSX.Element => {
  const router = useRouter();
  const { authorsBlacklist } = useBlacklistContext();
  const { acc, avatar, name } = cardContent;

  const openUsersPage = () => {
    router.push(`/user/${acc}`);
  };

  const avatarSrc = avatar
    ? `data:image/jpeg;base64,${avatar}`
    : '/default-avatar.png';

  if (authorsBlacklist && authorsBlacklist[acc]) {
    return null;
  }

  return (
    <Card onClick={openUsersPage}>
      <BlurContainer>
        <Blur img={avatarSrc} />
      </BlurContainer>
      <BottomSection height="184px">
        <IconContainer>
          <Image width="82px" height="82px" src={avatarSrc} alt={name} />
        </IconContainer>
        <Title>{name || acc}</Title>
        <PurpleName>@{acc}</PurpleName>
      </BottomSection>
    </Card>
  );
};

export default CreatorCard;
