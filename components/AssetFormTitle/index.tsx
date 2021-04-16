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

type Props = {
  templateName: string;
  collectionName: string;
  collectionAuthor: string;
  assetIds?: string[];
  saleIds?: string[];
  setCurrentAssetAsModalProps?: () => void;
};

const AssetFormTitle = ({
  templateName,
  collectionName,
  collectionAuthor,
  assetIds,
  saleIds,
  setCurrentAssetAsModalProps,
}: Props): JSX.Element => {
  const router = useRouter();
  const { currentUser } = useAuthContext();
  const isMyTemplate = router.pathname.includes('my-templates');
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
          width={24}
          height={24}
          src="/icon-monsters.png"
          alt="Crypto Monsters icon"
        />
        <Title>{capitalize(collectionName)}</Title>
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
