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
  PlaceholderIcon,
} from './TemplateCard.styled';
import CollectionIcon, { IconContainer } from '../CollectionIcon';
import { capitalize } from '../../utils';
import TemplateImage from '../TemplateImage';
import TemplateVideo from '../TemplateVideo';
import { IPFS_RESOLVER } from '../../utils/constants';

type Props = {
  collectionName: string;
  templateName: string;
  maxSupply: string;
  isUsersTemplates?: boolean;
  redirectPath?: string;
  totalAssets?: string;
  assetsForSale?: string;
  collectionImage?: string;
  templateVideo?: string;
  templateImage?: string;
  price?: string;
  hasMultiple?: boolean;
  noHoverEffect?: boolean;
  isStatic?: boolean;
  noIpfsConversion?: boolean;
  autoPlay?: boolean;
  hasPlaceholderIcon?: boolean;
};

const TemplateCard = ({
  collectionName,
  templateName,
  maxSupply,
  redirectPath,
  isUsersTemplates,
  totalAssets,
  assetsForSale,
  collectionImage,
  templateVideo,
  templateImage,
  price,
  noHoverEffect,
  hasMultiple,
  noIpfsConversion,
  isStatic,
  autoPlay,
  hasPlaceholderIcon,
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
      router.push(`/${collectionName}`);
    }
  };

  const handleEnterKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !isStatic) {
      openDetailPage();
    }
  };

  const templateVideoSrc = noIpfsConversion
    ? templateVideo
    : `${IPFS_RESOLVER}${templateVideo}`;

  const templateImgSrc =
    noIpfsConversion || !templateImage
      ? templateImage
      : `${IPFS_RESOLVER}${templateImage}`;

  const priceTag =
    isUsersTemplates && assetsForSale && totalAssets ? (
      <Tag>
        {assetsForSale}/{totalAssets} FOR SALE
      </Tag>
    ) : null;

  const collectionIcon = hasPlaceholderIcon ? (
    <IconContainer margin="24px 16px 24px 0">
      <PlaceholderIcon />
    </IconContainer>
  ) : (
    <CollectionIcon
      name={collectionName}
      image={collectionImage}
      margin="24px 16px 24px 0"
    />
  );

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
          {collectionIcon}
          <Text>{capitalize(collectionName)}</Text>
        </CollectionNameButton>
      </Row>
      {templateVideo ? (
        <TemplateVideo
          src={templateVideoSrc}
          priceTag={priceTag}
          autoPlay={autoPlay}
        />
      ) : (
        <TemplateImage
          templateImgSrc={templateImgSrc}
          templateName={templateName}
          priceTag={priceTag}
        />
      )}
      <Title>{templateName}</Title>
      <GreyText>Edition size: {maxSupply}</GreyText>
      {price ? <Text>{price}</Text> : <PlaceholderPrice aria-hidden />}
    </Card>
  );
};

TemplateCard.defaultProps = {
  collectionName: 'Collection',
  templateName: 'Name',
  maxSupply: 0,
  hasMultiple: false,
};

export default TemplateCard;
