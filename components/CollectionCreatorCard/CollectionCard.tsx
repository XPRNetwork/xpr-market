import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useBlacklistContext } from '../Provider';
import {
  Card,
  Blur,
  BlurContainer,
  Title,
  // Description,
  BottomSection,
  IconContainer,
} from './CollectionCreatorCard.styled';
import { Image } from '../../styles/index.styled';
import { SearchCollection } from '../../services/search';
import {
  RESIZER_IMAGE,
  IPFS_RESOLVER_IMAGE,
  PROPAGATION_LAG_TIME,
} from '../../utils/constants';
import { getCachedFiles } from '../../services/upload';

type Props = {
  cardContent: SearchCollection;
};

const CollectionCard = ({ cardContent }: Props): JSX.Element => {
  const router = useRouter();
  const { collectionsBlacklist } = useBlacklistContext();
  const [collectionImgSrc, setCollectionImgSrc] = useState<string>('');
  const {
    img,
    name,
    /* description, */ collection_name,
    created,
  } = cardContent;
  const fallbackImgSrc = `${IPFS_RESOLVER_IMAGE}${img}`;

  useEffect(() => {
    (async () => {
      if (new Date().getTime() - parseInt(created) < PROPAGATION_LAG_TIME) {
        const cachedFile = await getCachedFiles(img);
        if (cachedFile[img]) {
          setCollectionImgSrc(cachedFile[img]);
          return;
        }
      }

      if (img) {
        setCollectionImgSrc(`${RESIZER_IMAGE}${IPFS_RESOLVER_IMAGE}${img}`);
        return;
      }

      setCollectionImgSrc('/icon-blank-collection.png');
    })();
  }, [img]);

  const openCollectionsPage = () => {
    router.push(`/${collection_name}`);
  };

  // TO DO: Description will most likely need to be commented out until backend team adds description into ES

  if (collectionsBlacklist && collectionsBlacklist[collection_name]) {
    return null;
  }

  return (
    <Card onClick={openCollectionsPage}>
      <BlurContainer>
        <Blur img={collectionImgSrc} />
      </BlurContainer>
      <BottomSection height="224px">
        <IconContainer>
          <Image
            width="82px"
            height="82px"
            src={collectionImgSrc}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallbackImgSrc;
            }}
            alt={name}
          />
        </IconContainer>
        <Title>{name}</Title>
        {/* <Description>{description}</Description> */}
      </BottomSection>
    </Card>
  );
};

export default CollectionCard;
