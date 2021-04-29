import '@google/model-viewer';
import { IPFS_RESOLVER_VIDEO } from '../../utils/constants';
import { ImageContainer } from './AssetDisplay.styled';

function parseIpfs(imageUrl: string) {
  if (!imageUrl) {
    return imageUrl;
  }

  if (imageUrl.substring(0, 2) === 'Qm') {
    imageUrl = `${IPFS_RESOLVER_VIDEO}${imageUrl}`;
  }

  return imageUrl;
}

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
      <model-viewer
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
        style={{
          height: '100%',
          width: '100%',
          borderRadius: 20,
        }}
      />
    </ImageContainer>
  );
};

export default AssetModel;
