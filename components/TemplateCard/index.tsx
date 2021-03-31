import { KeyboardEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  Card,
  Row,
  ImageContainer,
  IconContainer,
  Title,
  Text,
  GreyText,
  Tag,
  PlaceholderIcon,
  PlaceholderPrice,
} from './TemplateCard.styled';
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
};

type ImageProps = {
  name: string;
  image?: string;
};

const CollectionIcon = ({ name, image }: ImageProps) =>
  image ? (
    <IconContainer>
      <Image priority layout="fill" alt={name} src={image} />
    </IconContainer>
  ) : (
    <PlaceholderIcon aria-hidden />
  );

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
}: Props): JSX.Element => {
  const router = useRouter();
  const openDetailPage = () => router.push(redirectPath);

  const handleEnterKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      openDetailPage();
    }
  };

  const imageSrc = templateImage
    ? `https://cloudflare-ipfs.com/ipfs/${templateImage}`
    : '/placeholder-template-image.png';

  const hasMultiple =
    totalAssets && !isNaN(parseInt(totalAssets)) && parseInt(totalAssets) > 1;

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
        <CollectionIcon name={collectionName} image={collectionImage} />
        <Text>{capitalize(collectionName)}</Text>
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
