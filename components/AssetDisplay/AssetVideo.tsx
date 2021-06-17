import { useEffect, useState } from 'react';
import { Video } from './AssetDisplay.styled';
import {
  IPFS_RESOLVER_VIDEO,
  PROPAGATION_LAG_TIME,
} from '../../utils/constants';
import { getCachedFiles } from '../../services/upload';

type Props = {
  video: string;
  created: string;
};

const AssetVideo = ({ video, created }: Props): JSX.Element => {
  const [src, setSrc] = useState<string>(`${IPFS_RESOLVER_VIDEO}${video}`);
  useEffect(() => {
    (async () => {
      if (new Date().getTime() - parseInt(created) < PROPAGATION_LAG_TIME) {
        const cachedFile = await getCachedFiles(video);
        if (cachedFile[video]) {
          setSrc(cachedFile[video]);
        }
      }
    })();
  }, [video]);

  return (
    <Video
      controls
      loop
      autoPlay
      onLoadStart={() =>
        (document.getElementsByTagName('video')[0].volume = 0.15)
      }
      src={src}
    />
  );
};

export default AssetVideo;
