/* eslint-disable jsx-a11y/media-has-caption */
import { VideoContainer, Video } from './TemplateVideo.styled';

type Props = {
  src: string;
  priceTag?: JSX.Element;
};

const TemplateVideo = ({ src, priceTag }: Props): JSX.Element => {
  return (
    <VideoContainer>
      <Video autoPlay loop src={src} width="100%" />
      {priceTag}
    </VideoContainer>
  );
};

export default TemplateVideo;
