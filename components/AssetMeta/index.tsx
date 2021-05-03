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
      property: 'og:title',
      content: title,
    },
    {
      key: 'twtitle',
      property: 'twitter:title',
      content: title,
    },
    {
      key: 'ogdescription',
      property: 'og:description',
      content: description,
    },
    {
      key: 'twdescription',
      property: 'twitter:description',
      content: description,
    },
  ];

  if (props.video) {
    metas = metas.concat([
      {
        key: 'twcard',
        property: 'twitter:card',
        content: 'player',
      },
      {
        key: 'ogvideo',
        property: 'og:video',
        content: `${IPFS_RESOLVER_VIDEO}${props.video}`,
      },
    ]);
  } else if (props.model) {
    metas = metas.concat([
      {
        key: 'ogtype',
        property: 'og:type',
        content: 'threed.asset',
      },
      {
        key: 'ogmodel',
        property: 'og:image',
        content: `${IPFS_RESOLVER_IMAGE}${props.image}`,
      },
    ]);
  } else if (props.image) {
    metas = metas.concat([
      {
        key: 'twcard',
        property: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        key: 'ogimage',
        property: 'og:image',
        content: `${IPFS_RESOLVER_IMAGE}${props.image}`,
      },
    ]);
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
