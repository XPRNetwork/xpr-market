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
  ShimmerBlock,
} from './TemplateCard.styled';
import CollectionIcon from '../CollectionIcon';
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
  useBlacklistContext,
} from '../Provider';
import { Template } from '../../services/templates';

type Props = {
  template: Template;
  isUsersTemplates?: boolean;
  hasShimmer?: boolean;
};

const TemplateCard = ({
  template,
  isUsersTemplates,
  hasShimmer,
}: Props): JSX.Element => {
  const {
    template_id,
    name,
    collection: { collection_name, img, name: collectionDisplayName },
    immutable_data: { image, video },
    max_supply,
    lowestPrice,
    totalAssets,
    assetsForSale,
    issued_supply,
    created_at_time,
  } = template;

  const { cachedNewlyCreatedAssets } = useCreateAssetContext();
  const { currentUser } = useAuthContext();
  const { templatesBlacklist } = useBlacklistContext();
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
      const videoSrc = `${IPFS_RESOLVER_VIDEO}${video}`;
      const imageSrc = !image
        ? image
        : `${RESIZER_IMAGE_SM}${IPFS_RESOLVER_IMAGE}${image}`;
      const fallbackImageSrc = image ? `${IPFS_RESOLVER_IMAGE}${image}` : '';

      setTemplateVideoSrc(videoSrc);
      setTemplateImgSrc(imageSrc);
      setFallbackImgSrc(fallbackImageSrc);
    }
  }, [video, image]);

  const router = useRouter();
  const isMyTemplate =
    currentUser && router.query.chainAccount === currentUser.actor;
  const redirectPath = isMyTemplate
    ? `/details/${currentUser.actor}/${collection_name}/${template_id}`
    : `/${collection_name}/${template_id}`;
  const ownerHasMultiple =
    totalAssets && !isNaN(parseInt(totalAssets)) && parseInt(totalAssets) > 1;
  const hasMultiple =
    !totalAssets && !isNaN(parseInt(issued_supply))
      ? parseInt(issued_supply) > 1
      : false;

  const openDetailPage = () => {
    router.push(redirectPath);
  };

  const openCollectionPage = (e: MouseEvent) => {
    e.stopPropagation();
    router.push(`/${collection_name}`);
  };

  const handleEnterKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      openDetailPage();
    }
  };

  const priceTag =
    isUsersTemplates && assetsForSale && totalAssets ? (
      <Tag>
        {assetsForSale}/{totalAssets} FOR SALE
      </Tag>
    ) : null;

  const priceSection = hasShimmer ? (
    <ShimmerBlock aria-hidden />
  ) : lowestPrice ? (
    <Text>{lowestPrice}</Text>
  ) : (
    <PlaceholderPrice aria-hidden />
  );

  if (templatesBlacklist && templatesBlacklist[template_id]) {
    return null;
  }

  return (
    <Card
      tabIndex={0}
      hasMultiple={ownerHasMultiple || hasMultiple}
      onClick={openDetailPage}
      onKeyDown={handleEnterKey}>
      <Row>
        <CollectionNameButton onClick={openCollectionPage}>
          <CollectionIcon
            name={collection_name}
            image={img}
            margin="24px 16px 24px 0"
          />
          <Text>{collectionDisplayName || collection_name}</Text>
        </CollectionNameButton>
      </Row>
      {video ? (
        <TemplateVideo
          src={templateVideoSrc}
          priceTag={priceTag}
          autoPlay={false}
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
  hasShimmer: false,
  isCreatePreview: false,
};

export default TemplateCard;
