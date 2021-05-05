import { KeyboardEvent, MouseEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Card,
  Row,
  Title,
  Text,
  GreyText,
  CollectionNameButton,
  PlaceholderPrice,
  ShimmerBlock,
} from '../TemplateCard/TemplateCard.styled';
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
} from '../../components/Provider';
import { SearchTemplate } from '../../services/search';
import { getTemplateDetails, Template } from '../../services/templates';

type Props = {
  template: SearchTemplate;
};

const SearchTemplateCard = ({ template }: Props): JSX.Element => {
  const {
    id,
    name,
    collection,
    created,
    img,
    video,
    issued_supply,
    max_supply,
  } = template;

  const { cachedNewlyCreatedAssets } = useCreateAssetContext();
  const { currentUser } = useAuthContext();
  const [templateVideoSrc, setTemplateVideoSrc] = useState<string>('');
  const [templateImgSrc, setTemplateImgSrc] = useState<string>('');
  const [fallbackImgSrc, setFallbackImgSrc] = useState<string>('');
  const [templateDetail, setTemplateDetail] = useState<Template>({});
  const [
    isLoadingTemplateDetails,
    setIsLoadingTemplateDetails,
  ] = useState<boolean>(true);

  useEffect(() => {
    if (Date.now() - 600000 < Number(created) && isMyTemplate) {
      // created within the last 10 minutes to deal with propagation lag
      if (cachedNewlyCreatedAssets[video]) {
        fileReader((result) => {
          setTemplateVideoSrc(result);
        }, cachedNewlyCreatedAssets[video]);
      }
      if (cachedNewlyCreatedAssets[img]) {
        fileReader((result) => {
          setTemplateImgSrc(result);
        }, cachedNewlyCreatedAssets[img]);
      }
    } else {
      const videoSrc = `${IPFS_RESOLVER_VIDEO}${video}`;
      const imageSrc = !img
        ? img
        : `${RESIZER_IMAGE_SM}${IPFS_RESOLVER_IMAGE}${img}`;
      const fallbackImageSrc = img ? `${IPFS_RESOLVER_IMAGE}${img}` : '';

      setTemplateVideoSrc(videoSrc);
      setTemplateImgSrc(imageSrc);
      setFallbackImgSrc(fallbackImageSrc);
    }
  }, [video, img]);

  useEffect(() => {
    (async () => {
      const templateDetail = await getTemplateDetails(collection, id);
      setTemplateDetail(templateDetail);
      setIsLoadingTemplateDetails(false);
    })();
  }, []);

  const router = useRouter();
  const isMyTemplate =
    currentUser && router.query.chainAccount === currentUser.actor;
  const redirectPath = `/${collection}/${id}`;
  const hasMultiple = !isNaN(parseInt(issued_supply))
    ? parseInt(issued_supply) > 1
    : false;

  const openDetailPage = () => {
    router.push(redirectPath);
  };

  const openCollectionPage = (e: MouseEvent) => {
    e.stopPropagation();
    router.push(`/${collection}`);
  };

  const handleEnterKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      openDetailPage();
    }
  };

  const priceSection = isLoadingTemplateDetails ? (
    <ShimmerBlock aria-hidden />
  ) : templateDetail.lowestPrice ? (
    <Text>{templateDetail.lowestPrice}</Text>
  ) : (
    <PlaceholderPrice aria-hidden />
  );

  return (
    <Card
      tabIndex={0}
      hasMultiple={hasMultiple}
      onClick={openDetailPage}
      onKeyDown={handleEnterKey}>
      <Row>
        <CollectionNameButton onClick={openCollectionPage}>
          <CollectionIcon
            name={collection}
            image={
              templateDetail &&
              templateDetail.collection &&
              templateDetail.collection.img
            }
            margin="24px 16px 24px 0"
          />
          {isLoadingTemplateDetails ? (
            <ShimmerBlock aria-hidden />
          ) : (
            <Text>{templateDetail.collection.name || collection}</Text>
          )}
        </CollectionNameButton>
      </Row>
      {video ? (
        <TemplateVideo src={templateVideoSrc} autoPlay={false} />
      ) : (
        <TemplateImage
          templateImgSrc={templateImgSrc}
          fallbackImgSrc={fallbackImgSrc}
          templateName={name}
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

export default SearchTemplateCard;