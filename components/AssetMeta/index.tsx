import {
  IPFS_RESOLVER_IMAGE,
  IPFS_RESOLVER_VIDEO,
} from '../../utils/constants';
import Head from 'next/head';

type Props = {
  templateName?: string;
  collectionDisplayName?: string;
  collectionAuthor?: string;
  image?: string;
  video?: string;
  model?: string;
};

export const AssetMeta = (props: Props): JSX.Element => {
  const metas = [
    {
      key: 'ogdesc',
      property: 'og:description',
      content: `${props.templateName} from ${props.collectionDisplayName} by ${props.collectionAuthor}`,
    },
  ];

  if (props.video) {
    metas.push({
      key: 'ogvideo',
      property: 'og:video',
      content: `${IPFS_RESOLVER_VIDEO}${props.video}`,
    });
  } else if (props.model) {
    metas.push({
      key: 'ogtype',
      property: 'og:type',
      content: 'threed.asset',
    });
    metas.push({
      key: 'og',
      property: 'og:image',
      content: `${IPFS_RESOLVER_IMAGE}${props.image}`,
    });
  } else if (props.image) {
    metas.push({
      key: 'ogimage',
      property: 'og:image',
      content: `${IPFS_RESOLVER_IMAGE}${props.image}`,
    });
  }

  return (
    <Head>
      {metas.map((meta) => (
        <meta key={meta.key} property={meta.property} content={meta.content} />
      ))}
    </Head>
  );
};

export default AssetMeta;
