import { KeyboardEvent, MouseEvent } from 'react';
import { useRouter } from 'next/router';
import {
  Card,
  Row,
  Title,
  Text,
  GreyText,
  Tag,
  CollectionNameButton,
  PlaceholderPrice,
} from './TemplateCard.styled';
import CollectionIcon from '../CollectionIcon';
import { capitalize } from '../../utils';
import TemplateImage from '../TemplateImage';

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
  noHoverEffect?: boolean;
  isStatic?: boolean;
  noIpfsConversion?: boolean;
  isVideo?: boolean;
  isAudio?: boolean;
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
  noHoverEffect,
  hasMultiple,
  noIpfsConversion,
  isStatic,
  isVideo,
  isAudio,
}: Props): JSX.Element => {
  const router = useRouter();
  const openDetailPage = () => {
    if (!isStatic) {
      router.push(redirectPath);
    }
  };
  const openCollectionPage = (e: MouseEvent) => {
    if (!isStatic) {
      e.stopPropagation();
      router.push(`/collection/${collectionName}`);
    }
  };

  const handleEnterKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !isStatic) {
      openDetailPage();
    }
  };

  const templateImgSrc =
    noIpfsConversion || !templateImage
      ? templateImage
      : `https://cloudflare-ipfs.com/ipfs/${templateImage}`;

  const collectionImgSrc =
    noIpfsConversion || !collectionImage
      ? collectionImage
      : `https://cloudflare-ipfs.com/ipfs/${collectionImage}`;

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
      noHoverEffect={noHoverEffect}
      onClick={redirectPath ? openDetailPage : null}
      onKeyDown={redirectPath ? handleEnterKey : null}
      isStatic={isStatic}>
      <Row>
        <CollectionNameButton isStatic={isStatic} onClick={openCollectionPage}>
          <CollectionIcon
            name={collectionName}
            image={collectionImgSrc}
            margin="24px 16px 24px 0"
          />
          <Text>{capitalize(collectionName)}</Text>
        </CollectionNameButton>
      </Row>
      <TemplateImage
        templateImgSrc={templateImgSrc}
        templateName={templateName}
        isAudio={isAudio}
        isVideo={isVideo}
        priceTag={priceTag}
      />
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
