import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthContext, useCreateAssetContext } from '../Provider';
import {
  Card,
  Blur,
  BlurContainer,
  Title,
  Description,
  BottomSection,
  IconContainer,
} from './CollectionCreatorCard.styled';
import { Image } from '../../styles/index.styled';
import { ElasticSearchCollection } from '../../services/collections';
import { RESIZER_IMAGE, IPFS_RESOLVER_IMAGE } from '../../utils/constants';
import { fileReader } from '../../utils';

type Props = {
  cardContent: ElasticSearchCollection;
};

const CollectionCard = ({ cardContent }: Props): JSX.Element => {
  const router = useRouter();
  const { cachedNewlyCreatedAssets } = useCreateAssetContext();
  const { currentUser } = useAuthContext();
  const [collectionImgSrc, setCollectionImgSrc] = useState<string>('');
  const {
    img,
    name,
    author,
    description,
    collection_name,
    created,
  } = cardContent;
  const isMyCollection = currentUser && author === currentUser.actor;
  const fallbackImgSrc = `${IPFS_RESOLVER_IMAGE}${img}`;

  useEffect(() => {
    if (Date.now() - 600000 < Number(created) && isMyCollection) {
      // created within the last 10 minutes to deal with propagation lag
      if (cachedNewlyCreatedAssets[img]) {
        fileReader((result) => {
          setCollectionImgSrc(result);
        }, cachedNewlyCreatedAssets[img]);
      }
    } else {
      setCollectionImgSrc(`${RESIZER_IMAGE}${IPFS_RESOLVER_IMAGE}${img}`);
    }
  }, [img]);

  const openCollectionsPage = () => {
    router.push(`/${collection_name}`);
  };

  // TO DO: Description will most likely need to be commented out until backend team adds description into ES

  return (
    <Card onClick={openCollectionsPage}>
      <BlurContainer>
        <Blur img={collectionImgSrc} />
      </BlurContainer>
      <BottomSection>
        <IconContainer>
          <Image
            width="88px"
            height="88px"
            src={collectionImgSrc}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallbackImgSrc;
            }}
            alt={name}
          />
        </IconContainer>
        <Title>{name}</Title>
        <Description>
          {description ||
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque iaculis, orci at fermentum blandit, dolor magna dictum arcu, sit amet ullamcorper enim nunc sit amet libero. Nunc nunc ipsum, rhoncus quis ipsum placerat, posuere scelerisque libero. Proin eu erat velit. Praesent ac dolor orci. Sed egestas metus quis pretium accumsan. Duis malesuada aliquam justo sit amet tristique. Nunc sem arcu, facilisis eget aliquam id, pharetra a enim. Mauris quis erat a nunc vehicula accumsan semper quis nulla. Duis vel felis venenatis, cursus ipsum id, vehicula metus.'}
        </Description>
      </BottomSection>
    </Card>
  );
};

export default CollectionCard;
