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
  const title = props.templateName;
  const description = `From ${props.collectionDisplayName} collection by ${props.collectionAuthor}`;

  let metas = [
    {
      key: 'ogtitle',
      name: 'og:title',
      content: title,
    },
    {
      key: 'twtitle',
      name: 'twitter:title',
      content: title,
    },
    {
      key: 'ogdescription',
      name: 'og:description',
      content: description,
    },
    {
      key: 'twdescription',
      name: 'twitter:description',
      content: description,
    },
  ];

  if (props.video) {
    metas = metas.concat([
      {
        key: 'twcard',
        name: 'twitter:card',
        content: 'player',
      },
      {
        key: 'ogvideo',
        name: 'og:video',
        content: `${IPFS_RESOLVER_VIDEO}${props.video}`,
      },
    ]);
  } else if (props.model) {
    metas = metas.concat([
      {
        key: 'ogtype',
        name: 'og:type',
        content: 'threed.asset',
      },
      {
        key: 'ogmodel',
        name: 'og:image',
        content: `${IPFS_RESOLVER_IMAGE}${props.image}`,
      },
    ]);
  } else if (props.image) {
    metas = metas.concat([
      {
        key: 'twcard',
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        key: 'ogimage',
        name: 'og:image',
        content: `${IPFS_RESOLVER_IMAGE}${props.image}`,
      },
    ]);
  }

  return (
    <Head>
      {metas.map((meta) => (
        <meta key={meta.key} name={meta.name} content={meta.content} />
      ))}
    </Head>
  );
};

export default AssetMeta;
