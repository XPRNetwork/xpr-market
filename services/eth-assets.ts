import { createAlchemyWeb3 } from "@alch/alchemy-web3";

const web3 = createAlchemyWeb3("https://polygon-mainnet.g.alchemy.com/v2/cZYm3F6HFecKtBJDWBLiYR2Bweqmwlnc");

export type ETH_ASSET = {
  contractAddress: string;
  tokenId: string;
  tokenType: string;
  tokenUri: string;
  attributes: {
    name: string;
    description: string;
    image: string;
  },
  balance: number;
}

export type NFT_ATTR = {
  name: string;
  image: string;
  description: string;
};

export const getNfts = async (
  owner: string
): Promise<ETH_ASSET[]> => {
  let ownedNfts = [];
  let pageKey = null;

  try {
    do {
      const response = await web3.alchemy.getNfts({
        owner,
        withMetadata: true,
        ...(pageKey ? {pageKey} : {})
      });
  
      if (response.ownedNfts?.length) {
        ownedNfts = ownedNfts.concat(response.ownedNfts);
      }
      pageKey = response.pageKey;
    } while(pageKey);

    return ownedNfts.map(nft => {
      return {
        contractAddress: nft.contract.address,
        tokenId: nft.id.tokenId,
        tokenType: nft.id.tokenMetadata?.tokenType,
        tokenUri: nft.tokenUri?.raw,
        balance: nft.balance,
        attributes: {
          name: nft.metadata.name,
          description: nft.metadata.description,
          image: nft.metadata.image
        }
      };
    });
  } catch (e) {
    throw new Error(e);
  }
}

export const getNftMetadata = async (
  tokenUri: string,
): Promise<NFT_ATTR> => {

  try {
    const response = await fetch(tokenUri);
    const nft = await response.json();
    return {
      name: nft.name,
      description: nft.description,
      image: nft.image
    };
  } catch(e) {
    throw new Error(e);
  }
}
