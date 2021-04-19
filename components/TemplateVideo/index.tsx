/* eslint-disable jsx-a11y/media-has-caption */
import { VideoContainer, Video, CenterContainer } from './TemplateVideo.styled';

type Props = {
  src: string;
  autoPlay?: boolean;
  controls?: boolean;
  priceTag?: JSX.Element;
};

const TemplateVideo = ({
  src,
  priceTag,
  autoPlay = false,
  controls = true,
}: Props): JSX.Element => {
  return (
    <VideoContainer>
      <CenterContainer>
        <Video muted autoPlay={autoPlay} controls={controls} loop src={src} />
        {priceTag}
      </CenterContainer>
    </VideoContainer>
  );
};

export default TemplateVideo;
