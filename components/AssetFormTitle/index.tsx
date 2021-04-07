import { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  NameContainer,
  Name,
  General,
  Title,
  Author,
  CollectionNameButton,
} from './AssetFormTitle.styled';
import AssetFormPopupMenu from '../AssetFormPopupMenu';
import { capitalize } from '../../utils';

type Props = {
  templateName: string;
  collectionName: string;
  collectionAuthor: string;
  transferNFT?: () => void;
  assetIds?: string[];
  saleIds?: string[];
};

const AssetFormTitle = ({
  templateName,
  collectionName,
  collectionAuthor,
  transferNFT,
  assetIds,
  saleIds,
}: Props): JSX.Element => {
  const router = useRouter();
  const isMyTemplate = router.pathname.includes('my-templates');
  const redirectToAuthor = () => router.push(`/my-items/${collectionAuthor}`);
  const redirectToCollection = () =>
    router.push(`/collection/${collectionName}`);

  useEffect(() => {
    router.prefetch(`/my-items/${collectionAuthor}`);
  }, []);

  return (
    <>
      <CollectionNameButton onClick={redirectToCollection}>
        <Image
          priority
          layout="fixed"
          width={24}
          height={24}
          src="/icon-monsters.png"
          alt="Crypto Monsters icon"
        />
        <Title>Crypto {capitalize(collectionName)}</Title>
      </CollectionNameButton>
      <NameContainer>
        <Name>{templateName}</Name>
        {isMyTemplate && (
          <AssetFormPopupMenu
            transferNFT={transferNFT}
            assetIds={assetIds}
            saleIds={saleIds}
          />
        )}
      </NameContainer>
      <General>
        Created by{' '}
        <Author onClick={redirectToAuthor}>
          {capitalize(collectionAuthor)}
        </Author>
      </General>
    </>
  );
};

export default AssetFormTitle;
