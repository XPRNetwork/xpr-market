import { KeyboardEvent, MouseEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  Card,
  Row,
  ImageContainer,
  Title,
  Text,
  GreyText,
  Tag,
  CollectionNameButton,
  PlaceholderPrice,
} from './TemplateCard.styled';
import CollectionIcon from '../CollectionIcon';
import { capitalize } from '../../utils';

type Props = {
  collectionName: string;
  templateName: string;
  editionSize: string;
  isUsersTemplates?: boolean;
  redirectPath?: string;
  totalAssets?: string;
  assetsForSale?: string;
  collectionImage?: string;
  templateImage?: string;
  price?: string;
  hasMultiple?: boolean;
};

const TemplateCard = ({
  collectionName,
  templateName,
  editionSize,
  redirectPath,
  isUsersTemplates,
  totalAssets,
  assetsForSale,
  collectionImage,
  templateImage,
  price,
  hasMultiple,
}: Props): JSX.Element => {
  const router = useRouter();
  const openDetailPage = () => router.push(redirectPath);
  const openCollectionPage = (e: MouseEvent) => {
    e.stopPropagation();
    router.push(`/collection/${collectionName}`);
  };

  const handleEnterKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      openDetailPage();
    }
  };

  const imageSrc = templateImage
    ? `https://cloudflare-ipfs.com/ipfs/${templateImage}`
    : '/placeholder-template-image.png';

  const priceTag =
    isUsersTemplates && assetsForSale && totalAssets ? (
      <Tag>
        {assetsForSale}/{totalAssets} FOR SALE
      </Tag>
    ) : null;

  return (
    <Card
      tabIndex={0}
      hasMultiple={hasMultiple}
      onClick={redirectPath ? openDetailPage : null}
      onKeyDown={redirectPath ? handleEnterKey : null}>
      <Row>
        <CollectionNameButton onClick={openCollectionPage}>
          <CollectionIcon
            name={collectionName}
            image={collectionImage}
            margin="24px 16px 24px 0"
          />
          <Text>{capitalize(collectionName)}</Text>
        </CollectionNameButton>
      </Row>
      <ImageContainer>
        <Image
          priority
          layout="responsive"
          width={213}
          height={220}
          alt={templateName}
          src={imageSrc}
        />
        {priceTag}
      </ImageContainer>
      <Title>{templateName}</Title>
      <GreyText>Edition size: {editionSize}</GreyText>
      {price ? <Text>{price}</Text> : <PlaceholderPrice aria-hidden />}
    </Card>
  );
};

TemplateCard.defaultProps = {
  collectionName: 'Collection',
  templateName: 'Name',
  editionSize: 0,
  hasMultiple: false,
};

export default TemplateCard;
