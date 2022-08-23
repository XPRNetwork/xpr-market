import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
const NftBridgeAbi = require("../abis/NftBridge.json");
const ERC721Abi = require("../abis/ERC721.json");

const web3 = createAlchemyWeb3("https://polygon-mainnet.g.alchemy.com/v2/cZYm3F6HFecKtBJDWBLiYR2Bweqmwlnc");
const EthBridgeAddress = "0x6bb77DEa7E6d163988231c52335b3d65D0ad805B";

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

export const transferERC721ToBridge = async (
  tokenContract: string,
  tokenId: string,
  from: string,
  signer: Web3Provider
) => {
  const nftContract = new ethers.Contract(tokenContract, ERC721Abi, signer);
  console.log(nftContract);
  await nftContract['safeTransferFrom(address,address,uint256)'](from, EthBridgeAddress, ethers.BigNumber.from(tokenId));
}

export const claimNfts = async (
  tokenContract: string,
  tokenIds: string[],
  signer: Web3Provider
) => {
  const nftBridgeContract = new ethers.Contract(EthBridgeAddress, NftBridgeAbi, signer);
  const res = await nftBridgeContract['claim(address,uint256[])'](tokenContract, tokenIds.map(el => ethers.BigNumber.from(el)));
  console.log(res);
  return { success: true };
}

export const teleportToProton = async ({
  tokenContract,
  tokenIds,
  provider,
  to
}: {
  tokenContract: string,
  tokenIds: string[],
  provider: Web3Provider,
  to: string
}) => {
  try {
    const nftBridgeContract = new ethers.Contract(EthBridgeAddress, NftBridgeAbi, provider);
    const res = await nftBridgeContract.teleport(
      tokenContract,
      tokenIds.map(el => ethers.BigNumber.from(el)),
      to
    );
    console.log(res);
    return { success: true };
  } catch (e) {
    console.log("-----------------4", e)
    const message = e.message[0].toUpperCase() + e.message.slice(1);
    return {
      success: false,
      error:
        message || 'An error has occurred while trying to cancel an auction.',
    };
  }
}
