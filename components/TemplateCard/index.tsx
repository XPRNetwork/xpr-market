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
  PlaceholderIcon,
  PlaceholderPrice,
} from './TemplateCard.styled';

type Props = {
  collectionName: string;
  collectionImage?: string;
  templateName: string;
  templateImage?: string;
  editionSize: string;
  hasMultiple: boolean;
  redirectPath?: string;
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

const TemplateImage = ({ name, image }: ImageProps) => {
  const imageSrc = image
    ? `https://cloudflare-ipfs.com/ipfs/${image}`
    : '/placeholder-template-image.png';

  return (
    <ImageContainer>
      <Image
        priority
        layout="responsive"
        width={213}
        height={220}
        alt={name}
        src={imageSrc}
      />
    </ImageContainer>
  );
};

const TemplateCard = ({
  collectionName,
  collectionImage,
  templateName,
  templateImage,
  hasMultiple,
  editionSize,
  price,
  redirectPath,
}: Props): JSX.Element => {
  const router = useRouter();

  const openDetailPage = () => router.push(redirectPath);

  const handleEnterKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      openDetailPage();
    }
  };

  return (
    <Card
      tabIndex={0}
      hasMultiple={hasMultiple}
      onClick={redirectPath ? openDetailPage : null}
      onKeyDown={redirectPath ? handleEnterKey : null}>
      <Row>
        <CollectionIcon name={collectionName} image={collectionImage} />
        <Text>{collectionName}</Text>
      </Row>
      <TemplateImage name={templateName} image={templateImage} />
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
