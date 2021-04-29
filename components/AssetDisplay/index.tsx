// import '@google/model-viewer'
import { ImageContainer, TemplateImage, Video } from './AssetDisplay.styled';
import {
  IPFS_RESOLVER_IMAGE,
  IPFS_RESOLVER_VIDEO,
} from '../../utils/constants';

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
}): JSX.Element => (
  <ImageContainer>
    <TemplateImage src={`${IPFS_RESOLVER_IMAGE}${image}`} alt={templateName} />
  </ImageContainer>
);

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

const AssetModel = ({
  model,
  stage,
  skybox,
}: {
  model: string;
  stage: string;
  skybox: string;
}): JSX.Element => {
  return (
    <ImageContainer>
      {/* <model-viewer
        src={parseIpfs(model)}
        ios-src={parseIpfs(stage)}
        skybox-image={parseIpfs(skybox)}
        auto-rotate
        autoplay
        ar
        ar-modes="scene-viewer webxr quick-look"
        ar-scale="auto"
        camera-controls
        camera-orbit="0deg 90deg 2.5m"
      /> */}
    </ImageContainer>
  );
};

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
    return <AssetModel model={model} stage={stage} skybox={skybox} />;
  } else {
    return <AssetImage image={image} templateName={templateName} />;
  }
};

export default AssetDisplay;
