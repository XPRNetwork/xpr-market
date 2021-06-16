import { useEffect, useState } from 'react';
import { Video } from './AssetDisplay.styled';
import { IPFS_RESOLVER_VIDEO } from '../../utils/constants';
import { getCachedFiles } from '../../services/upload';

const AssetVideo = ({ video }: { video: string }): JSX.Element => {
  const [src, setSrc] = useState<string>(`${IPFS_RESOLVER_VIDEO}${video}`);
  useEffect(() => {
    (async () => {
      const cachedFile = await getCachedFiles(video);
      if (cachedFile[video]) {
        setSrc(cachedFile[video]);
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
