import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { Web3Provider } from "@ethersproject/providers";
import { ethers } from 'ethers';
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
const NftBridgeAbi = require("../abis/NftBridge.json");
const ERC721Abi = require("../abis/ERC721.json");
const ERC1155Abi = require("../abis/ERC1155.json");

const web3 = createAlchemyWeb3(process.env.NEXT_PUBLIC_ALCHEMY_URL);

const injected = new InjectedConnector({
  supportedChainIds: [137]
});

const walletconnect = new WalletConnectConnector({
  rpcUrl: process.env.NEXT_PUBLIC_ALCHEMY_URL,
  bridge: "https://bridge.walletconnect.org",
  qrcode: true
});

const walletlink = new WalletLinkConnector({
  url: process.env.NEXT_PUBLIC_ALCHEMY_URL,
  appName: "proton-market"
});

export const connectors = {
  injected: injected,
  walletConnect: walletconnect,
  coinbaseWallet: walletlink
};


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

export enum NftType {
  ERC_721 = "erc721",
  ERC_1155 = "erc1155"
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
      image: nft.image != "" ? nft.image : nft.nft?.urlThumbnail
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
  const res = await nftContract['safeTransferFrom(address,address,uint256)'](
    from,
    process.env.NEXT_PUBLIC_NFT_BRIDGE_ADDRESS,
    ethers.BigNumber.from(tokenId)
  );
  return res;
}

export const transferERC1155ToBridge = async (
  tokenContract: string,
  tokenId: string,
  from: string,
  amount: number,
  signer: Web3Provider
) => {
  const nftContract = new ethers.Contract(tokenContract, ERC1155Abi, signer);
  const res = await nftContract['safeTransferFrom(address,address,uint256,uint256,bytes)'](
    from,
    process.env.NEXT_PUBLIC_NFT_BRIDGE_ADDRESS,
    ethers.BigNumber.from(tokenId),
    amount,
    "0x"
  );
  return res;
}

export const claimNfts = async (
  tokenContract: string,
  tokenIds: string[],
  signer: Web3Provider
) => {
  const nftBridgeContract = new ethers.Contract(
    process.env.NEXT_PUBLIC_NFT_BRIDGE_ADDRESS,
    NftBridgeAbi,
    signer
  );
  const res = await nftBridgeContract['claim(address,uint256[])'](tokenContract, tokenIds.map(el => ethers.BigNumber.from(el)));
  return res;
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
    const nftBridgeContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_NFT_BRIDGE_ADDRESS,
      NftBridgeAbi,
      provider
    );
    const res = await nftBridgeContract.teleport(
      tokenContract,
      tokenIds.map(el => ethers.BigNumber.from(el)),
      to
    );
    return res;
  } catch (e) {
    const message = e.message[0].toUpperCase() + e.message.slice(1);
    return {
      success: false,
      error:
        message || 'An error has occurred while trying to teleport.',
    };
  }
}

export const getDepositList = async (owner: string, provider: Web3Provider) => {
  try {
    const nftBridgeContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_NFT_BRIDGE_ADDRESS,
      NftBridgeAbi,
      provider
    );
    const res = await nftBridgeContract.tokensByUser(owner);
    return res;
  } catch (e) {
    const message = e.message[0].toUpperCase() + e.message.slice(1);
    return {
      success: false,
      error:
        message || 'An error has occurred while trying to teleport.',
    };
  }
}
