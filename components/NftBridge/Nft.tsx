import { useState, useEffect } from 'react';
import { ETH_ASSET, NFT_ATTR, getNftMetadata } from '../../services/ethereum';
import { Asset } from '../../services/assets';
import { NftName, NftItem } from './NftBridge.styled';
import { Image } from '../../styles/index.styled';

interface EthNftProps {
  data: ETH_ASSET,
  selectedNft?: ETH_ASSET;
  setSelectedNft?: (nft: ETH_ASSET) => void;
};

export const EthNft = (props: EthNftProps) => {
  const [attributes, setAttributes] = useState<NFT_ATTR>();

  useEffect(() => {
    if (props?.data.attributes.name) {
      setAttributes(props.data.attributes);
    } else if (props.data.tokenUri) {
      getNftMetadata(props.data.tokenUri)
      .then(attr => {
        setAttributes(attr);
      });
    }
  }, [props?.data.tokenUri]);

  return (
    <NftItem
      selected={props.selectedNft?.contractAddress == props.data.contractAddress && props.selectedNft?.tokenId == props.data.tokenId}
      onClick={() => props.setSelectedNft && props.setSelectedNft(props.data)}
    >
      <Image
        src={attributes?.image}
        width="48"
        height='48'
        style={{marginRight: 20, borderRadius: 4}}
      />
      <NftName>{attributes?.name}</NftName>
    </NftItem>
  )
}

interface ProtonNftProps {
  data: any,
  selectedNft?: Asset;
  setSelectedNft?: (nft: Asset) => void;
};

export const ProtonNft = (props: ProtonNftProps) => {
  const [attributes, setAttributes] = useState<NFT_ATTR>();

  useEffect(() => {
    if (props.data.data.token_uri) {
      getNftMetadata(props.data.data.token_uri)
      .then(attr => {
        setAttributes(attr);
      });
    }
  }, [props?.data.data.token_uri]);

  return (
    <NftItem
      selected={props.selectedNft?.asset_id == props.data.asset_id}
      onClick={() => props.setSelectedNft && props.setSelectedNft(props.data)}
    >
      <Image
        src={attributes?.image}
        width="50"
        height='50'
        style={{marginRight: 20, borderRadius: 4}}
      />
      <NftName>{attributes?.name}</NftName>
    </NftItem>
  )
}
