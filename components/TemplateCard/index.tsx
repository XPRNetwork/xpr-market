import { KeyboardEvent, MouseEvent, useEffect, useState } from 'react';
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
  ShimmerBlock,
} from './TemplateCard.styled';
import CollectionIcon, { IconContainer } from '../CollectionIcon';
import { fileReader } from '../../utils';
import TemplateImage from '../TemplateImage';
import TemplateVideo from '../TemplateVideo';
import {
  IPFS_RESOLVER_VIDEO,
  IPFS_RESOLVER_IMAGE,
  RESIZER_IMAGE_SM,
} from '../../utils/constants';
import {
  useCreateAssetContext,
  useAuthContext,
} from '../../components/Provider';
import { Template } from '../../services/templates';
import { getClientBuildManifest } from 'next/dist/client/route-loader';

type Props = {
  template: Template;
  redirectPath?: string;
  hasMultiple?: boolean;
  noHoverEffect?: boolean;
  imageHoverEffect?: boolean;
  isStatic?: boolean;
  isUsersTemplates?: boolean;
  isCreatePreview?: boolean;
  autoPlay?: boolean;
  hasPlaceholderIcon?: boolean;
  hasShimmer?: boolean;
};

const TemplateCard = ({
  template,
  redirectPath,
  noHoverEffect,
  hasMultiple,
  isCreatePreview,
  isStatic,
  isUsersTemplates,
  autoPlay,
  hasPlaceholderIcon,
  imageHoverEffect,
  hasShimmer,
}: Props): JSX.Element => {
  const {
    name,
    collection: { collection_name, img, name: collectionDisplayName },
    immutable_data: { image, video },
    max_supply,
    lowestPrice,
    totalAssets,
    assetsForSale,
    created_at_time,
  } = template;

  const { cachedNewlyCreatedAssets } = useCreateAssetContext();
  const { currentUser } = useAuthContext();
  const [templateVideoSrc, setTemplateVideoSrc] = useState<string>('');
  const [templateImgSrc, setTemplateImgSrc] = useState<string>('');
  const [fallbackImgSrc, setFallbackImgSrc] = useState<string>('');

  useEffect(() => {
    if (Date.now() - 600000 < Number(created_at_time) && isMyTemplate) {
      // created within the last 10 minutes to deal with propagation lag
      if (cachedNewlyCreatedAssets[video]) {
        fileReader((result) => {
          setTemplateVideoSrc(result);
        }, cachedNewlyCreatedAssets[video]);
      }
      if (cachedNewlyCreatedAssets[image]) {
        fileReader((result) => {
          setTemplateImgSrc(result);
        }, cachedNewlyCreatedAssets[image]);
      }
    } else {
      const videoSrc = isCreatePreview
        ? video
        : `${IPFS_RESOLVER_VIDEO}${video}`;
      const imageSrc =
        isCreatePreview || !image
          ? image
          : `${RESIZER_IMAGE_SM}${IPFS_RESOLVER_IMAGE}${image}`;
      const fallbackImageSrc =
        !isCreatePreview && image ? `${IPFS_RESOLVER_IMAGE}${image}` : '';

      setTemplateVideoSrc(videoSrc);
      setTemplateImgSrc(imageSrc);
      setFallbackImgSrc(fallbackImageSrc);
    }
  }, [video, image]);

  const router = useRouter();
  const isMyTemplate =
    currentUser && router.query.chainAccount === currentUser.actor;
  const openDetailPage = () => {
    if (!isStatic) {
      router.push(redirectPath);
    }
  };
  const openCollectionPage = (e: MouseEvent) => {
    if (!isStatic) {
      e.stopPropagation();
      router.push(`/${collection_name}`);
    }
  };

  const handleEnterKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !isStatic) {
      openDetailPage();
    }
  };

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
      name={collection_name}
      image={img}
      margin="24px 16px 24px 0"
    />
  );

  const priceSection = hasShimmer ? (
    <ShimmerBlock aria-hidden />
  ) : lowestPrice ? (
    <Text>{lowestPrice}</Text>
  ) : (
    <PlaceholderPrice aria-hidden />
  );

  return (
    <Card
      tabIndex={0}
      hasMultiple={hasMultiple}
      noHoverEffect={noHoverEffect}
      imageHoverEffect={imageHoverEffect}
      onClick={redirectPath ? openDetailPage : null}
      onKeyDown={redirectPath ? handleEnterKey : null}
      isStatic={isStatic}>
      <Row>
        <CollectionNameButton isStatic={isStatic} onClick={openCollectionPage}>
          {collectionIcon}
          <Text>{collectionDisplayName || collection_name}</Text>
        </CollectionNameButton>
      </Row>
      {video ? (
        <TemplateVideo
          src={templateVideoSrc}
          priceTag={priceTag}
          autoPlay={autoPlay}
        />
      ) : (
        <TemplateImage
          templateImgSrc={templateImgSrc}
          fallbackImgSrc={fallbackImgSrc}
          templateName={name}
          priceTag={priceTag}
        />
      )}
      <Title>{name}</Title>
      <GreyText>
        Edition size: {max_supply === '0' ? 'Unlimited' : max_supply}
      </GreyText>
      {priceSection}
    </Card>
  );
};

TemplateCard.defaultProps = {
  collectionName: 'Collection',
  templateName: 'Name',
  maxSupply: 0,
  hasMultiple: false,
  hasShimmer: false,
  isCreatePreview: false,
};

export default TemplateCard;
