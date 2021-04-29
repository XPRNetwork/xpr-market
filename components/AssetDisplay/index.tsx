import { ImageContainer, TemplateImage, Video } from './AssetDisplay.styled';
import {
  IPFS_RESOLVER_IMAGE,
  IPFS_RESOLVER_VIDEO,
  RESIZER_IMAGE,
} from '../../utils/constants';
import dynamic from 'next/dynamic';

const AssetModelWithNoSsr = dynamic(() => import('./AssetModel'), {
  ssr: false,
});

type Props = {
  image?: string;
  video?: string;
  model?: string;
  stage?: string;
  skybox?: string;
  templateName: string;
};

const AssetImage = ({
  image,
  templateName,
}: {
  image: string;
  templateName: string;
}): JSX.Element => {
  const onImageError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = `${IPFS_RESOLVER_IMAGE}${image}`;
  };

  return (
    <ImageContainer>
      <TemplateImage
        src={`${RESIZER_IMAGE}${IPFS_RESOLVER_IMAGE}${image}`}
        alt={templateName}
        onError={onImageError}
      />
    </ImageContainer>
  );
};

const AssetVideo = ({ video }: { video: string }): JSX.Element => (
  <ImageContainer>
    <Video
      controls
      loop
      autoPlay
      onLoadStart={() =>
        (document.getElementsByTagName('video')[0].volume = 0.15)
      }
      src={`${IPFS_RESOLVER_VIDEO}${video}`}
    />
  </ImageContainer>
);

export const AssetDisplay = ({
  image,
  video,
  model,
  stage,
  skybox,
  templateName,
}: Props): JSX.Element => {
  if (video) {
    return <AssetVideo video={video} />;
  } else if (model) {
    return <AssetModelWithNoSsr model={model} stage={stage} skybox={skybox} />;
  } else {
    return <AssetImage image={image} templateName={templateName} />;
  }
};

export default AssetDisplay;
