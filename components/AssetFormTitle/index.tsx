import { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  NameContainer,
  Name,
  AuthorText,
  Title,
  Author,
  CollectionNameButton,
} from './AssetFormTitle.styled';
import AssetFormPopupMenu from '../AssetFormPopupMenu';
import { useAuthContext } from '../Provider';
import { capitalize } from '../../utils';
import { IPFS_RESOLVER } from '../../utils/constants';

type Props = {
  templateName: string;
  collectionDisplayName?: string;
  collectionName: string;
  collectionAuthor: string;
  collectionImage: string;
  assetIds?: string[];
  saleIds?: string[];
  setCurrentAssetAsModalProps?: () => void;
};

const AssetFormTitle = ({
  templateName,
  collectionName,
  collectionDisplayName,
  collectionAuthor,
  collectionImage,
  assetIds,
  saleIds,
  setCurrentAssetAsModalProps,
}: Props): JSX.Element => {
  const router = useRouter();
  const { currentUser } = useAuthContext();
  const isMyTemplate =
    currentUser && router.query.chainAccount === currentUser.actor;
  const redirectToAuthor = () => router.push(`/my-items/${collectionAuthor}`);
  const redirectToCollection = () => router.push(`/${collectionName}`);

  useEffect(() => {
    router.prefetch(`/my-items/${collectionAuthor}`);
  }, []);

  return (
    <>
      <CollectionNameButton onClick={redirectToCollection}>
        <Image
          priority
          layout="fixed"
          width={32}
          height={32}
          src={
            collectionImage
              ? `${IPFS_RESOLVER}${collectionImage}`
              : '/icon-monsters.png'
          }
          alt={`${collectionName} icon`}
        />
        <Title>{capitalize(collectionDisplayName || collectionName)}</Title>
      </CollectionNameButton>
      <NameContainer>
        <Name>{templateName}</Name>
        {isMyTemplate && (
          <AssetFormPopupMenu
            setCurrentAssetAsModalProps={setCurrentAssetAsModalProps}
            assetIds={assetIds}
            saleIds={saleIds}
            isTemplateCreator={
              currentUser && collectionAuthor === currentUser.actor
            }
          />
        )}
      </NameContainer>
      <AuthorText>
        Created by{' '}
        <Author onClick={redirectToAuthor}>
          {capitalize(collectionAuthor)}
        </Author>
      </AuthorText>
    </>
  );
};

export default AssetFormTitle;
