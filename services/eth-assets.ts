import { createAlchemyWeb3 } from "@alch/alchemy-web3";

const web3 = createAlchemyWeb3("https://polygon-mainnet.g.alchemy.com/v2/cZYm3F6HFecKtBJDWBLiYR2Bweqmwlnc");

export type ETH_ASSET = {
  contractAddress: string;
  tokenId: string;
  tokenType: string;
  attributes: {
    description: string;
    image: string;
    name: string;
  };
  balance: number;
}

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

    console.log("--- owned nfts", ownedNfts);
    return ownedNfts.map(nft => {
      return {
        contractAddress: nft.contract.address,
        tokenId: nft.id.tokenId,
        tokenType: nft.id.tokenMetadata.tokenType,
        attributes: nft.metadata,
        balance: nft.balance
      };
    });
  } catch (e) {
    throw new Error(e);
  }
}
