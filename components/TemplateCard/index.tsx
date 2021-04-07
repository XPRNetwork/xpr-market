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
  IconContainer,
} from './TemplateCard.styled';
import CollectionIcon from '../CollectionIcon';
import { capitalize } from '../../utils';
import { ReactComponent as AudioIcon } from '../../public/audio.svg';
import { ReactComponent as VideoIcon } from '../../public/video.svg';

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

  const img = noIpfsConversion
    ? templateImage
    : `https://cloudflare-ipfs.com/ipfs/${templateImage}`;
  const imageSrc = templateImage ? img : '/placeholder-template-image.png';

  const priceTag =
    isUsersTemplates && assetsForSale && totalAssets ? (
      <Tag>
        {assetsForSale}/{totalAssets} FOR SALE
      </Tag>
    ) : null;

  const getImageContent = () => {
    if (isAudio) {
      return (
        <IconContainer>
          <AudioIcon />
        </IconContainer>
      );
    } else if (isVideo) {
      return (
        <IconContainer>
          <VideoIcon />
        </IconContainer>
      );
    } else {
      return (
        <Image
          priority
          layout="responsive"
          width={213}
          height={220}
          alt={templateName}
          src={imageSrc}
        />
      );
    }
  };

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
            image={collectionImage}
            margin="24px 16px 24px 0"
          />
          <Text>{capitalize(collectionName)}</Text>
        </CollectionNameButton>
      </Row>
      <ImageContainer isAudio={isAudio} isVideo={isVideo}>
        {getImageContent()}
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
