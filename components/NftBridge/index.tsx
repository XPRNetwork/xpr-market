import { useState, useEffect } from 'react';
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from '@web3-react/core';
import {
  Header,
  HeaderTitle,
  SubTitle,
  ContentHeader,
  Container,
  Content,
  Switch,
  CurrentDir,
  NextDir,
  MessageBox,
  MessageContent,
  NftBox,
  NftList,
  NftExchangeBtnBox,
} from './NftBridge.styled';
import { Image } from '../../styles/index.styled';
import Button from '../Button';
import { ETH_ASSET, getNfts, teleportToProton, transferERC721ToBridge, claimNfts } from '../../services/ethereum';
import protonSDK from '../../services/proton';
import proton, { TeleportFees } from '../../services/proton-rpc';
import { Asset, getAllUserAssetsByTemplate } from '../../services/assets';
import LoadingPage from '../LoadingPage';
import { useAuthContext } from '../Provider';
import { EthNft, ProtonNft } from './Nft';
import InputField from '../InputField';

const TRANSFER_DIR = {
  ETH_TO_PROTON: 'ETH_TO_PROTON',
  PROTON_TO_ETH: 'PROTON_TO_ETH'
};

const injected = new InjectedConnector({
  supportedChainIds: [137, 3]
});

const NftBridge = (): JSX.Element => {
  const { currentUser, isLoadingUser } = useAuthContext();
  const { library, account, active, activate, deactivate } = useWeb3React();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transDir, setTransDir] = useState<string>(TRANSFER_DIR.ETH_TO_PROTON);
  const [ethAssetsOrigin, setEthAssetsOrigin] = useState<ETH_ASSET[]>([]);
  const [ethAssetsToSend, setEthAssetsToSend] = useState<ETH_ASSET[]>([]);
  const [protonAssetsOrigin, setProtonAssetsOrigin] = useState<Asset[]>([]);
  const [protonAssetsToSend, setProtonAssetsToSend] = useState<Asset[]>([]);
  const [selectedEthNft, setSelectedEthNft] = useState<ETH_ASSET | null>(null);
  const [selectedProtonNft, setSelectedProtonNft] = useState<Asset | null>(null);
  const [targetAddress, setTargetAddress] = useState<string>("");
  const [teleportFees, setTeleportFees] = useState<TeleportFees[]>([]);
  const [feesBalance, setFeesBalance] = useState<string>("");

  useEffect(() => {
    if (localStorage.getItem("connected") === "YES" && !active) {
      localStorage.removeItem("connected");
    }

    (async () => {
      const fees = await proton.getTeleportFees();
      setTeleportFees(fees);
    })();
  }, []);

  useEffect(() => {
    if (active) {
      localStorage.setItem("connected", "YES");
    }
  }, [active]);

  useEffect(() => {
    setEthAssetsOrigin([]);
    setEthAssetsToSend([]);
    fetchEthAssets();
  }, [account]);

  useEffect(() => {
    setProtonAssetsOrigin([]);
    setProtonAssetsToSend([]);
    (async () => {
      if (currentUser?.actor) {
        setIsLoading(true);

        try {
          const assets = await getAllUserAssetsByTemplate(currentUser.actor, undefined);
          setProtonAssetsOrigin(assets);

          const balance = await proton.getFeesBalanceForTeleport(currentUser.actor);
          setFeesBalance(balance);

          setIsLoading(false);
        } catch (e) {
          console.warn(e.message);
          setIsLoading(false);
        }
      }
    })();
  }, [currentUser?.actor]);

  const onWalletAction = () => {
    if (active) {
      deactivate();
      localStorage.clear();
      return;
    }
    activate(injected, (error) => {
      console.log(error);
    });
  }

  const fetchEthAssets = async () => {
    if (!account) {
      return;
    }

    setIsLoading(true);
    const nfts = await getNfts(account);
    setEthAssetsOrigin(nfts);
    setIsLoading(false);
  }

  const onExchange = async (dir: boolean) => {
    if (
      (transDir == TRANSFER_DIR.ETH_TO_PROTON && !selectedEthNft) ||
      (transDir == TRANSFER_DIR.PROTON_TO_ETH && !selectedProtonNft)
    ) return;

    if (dir && transDir == TRANSFER_DIR.ETH_TO_PROTON) {
      const index = ethAssetsOrigin.findIndex((nft: ETH_ASSET) => nft.contractAddress == selectedEthNft.contractAddress && nft.tokenId == selectedEthNft.tokenId);
      if (index > -1) {
        setEthAssetsOrigin(
          ethAssetsOrigin.filter((nft: ETH_ASSET) => nft.contractAddress !== selectedEthNft.contractAddress && nft.tokenId !== selectedEthNft.tokenId)
        );
  
        ethAssetsToSend.push(selectedEthNft);
        setEthAssetsToSend(ethAssetsToSend);
        setSelectedEthNft(null);
      }
    } else if (!dir && transDir == TRANSFER_DIR.ETH_TO_PROTON) {
      const index = ethAssetsToSend.findIndex((nft: ETH_ASSET) => nft.contractAddress == selectedEthNft.contractAddress && nft.tokenId == selectedEthNft.tokenId);
      if (index > -1) {
        setEthAssetsToSend(
          ethAssetsToSend.filter((nft: ETH_ASSET) => nft.contractAddress !== selectedEthNft.contractAddress && nft.tokenId !== selectedEthNft.tokenId)
        );

        ethAssetsOrigin.push(selectedEthNft);
        setEthAssetsOrigin(ethAssetsOrigin);
        setSelectedEthNft(null);
      }
    } else if (dir && transDir == TRANSFER_DIR.PROTON_TO_ETH) {
      const index = protonAssetsOrigin.findIndex((nft: Asset) => nft.asset_id == selectedProtonNft.asset_id);
      if (index > -1) {
        setProtonAssetsOrigin(
          protonAssetsOrigin.filter((nft: Asset) => nft.asset_id !== selectedProtonNft.asset_id)
        );

        protonAssetsToSend.push(selectedProtonNft);
        setProtonAssetsToSend(protonAssetsToSend);
        setSelectedProtonNft(null);
      }
    } else {
      const index = protonAssetsToSend.findIndex((nft: Asset) => nft.asset_id == selectedProtonNft.asset_id);
      if (index > -1) {
        setProtonAssetsToSend(
          protonAssetsToSend.filter((nft: Asset) => nft.asset_id !== selectedProtonNft.asset_id)
        );

        protonAssetsOrigin.push(selectedProtonNft);
        setProtonAssetsOrigin(protonAssetsOrigin);
        setSelectedProtonNft(null);
      }
    }
  }

  const handleTransfer = async () => {
    // try {
    //   if (
    //     (!ethAssetsToSend.length && transDir == TRANSFER_DIR.ETH_TO_PROTON) ||
    //     (!protonAssetsToSend.length && transDir == TRANSFER_DIR.PROTON_TO_ETH)
    //   ) {
    //     alert("Please select NFTs to send.");
    //     return;
    //   }
  
    //   if (!library) {
    //     alert("Please connect ethereum wallet.");
    //     return;
    //   }
  
    //   if (transDir === TRANSFER_DIR.ETH_TO_PROTON) {
    //     const tokenIds = ethAssetsToSend.map((nft: ETH_ASSET) => nft.tokenId);
    //     const tokenContract = ethAssetsToSend[0].contractAddress;
    //     setIsLoading(true);
    //     // Group by contract and token type (721, 1155)
    //     // await transferERC721ToBridge(tokenContract, tokenIds[0], account, library.getSigner());

    //     // Claim
    //     // await claimNfts("0xcd494673999194365033d7a287af9f0a3b163874", ["1174"], library.getSigner());

    //     // Teleport or claim
    //     await teleportToProton({
    //       tokenContract: "0xcd494673999194365033d7a287af9f0a3b163874",
    //       tokenIds: ["1174"],
    //       provider: library.getSigner(),
    //       to: currentUser.actor
    //     });
    //     setIsLoading(false);
    //   } else {
    //     const res = await protonSDK.transfer({
    //       sender: currentUser?.actor,
    //       recipient: "bridgetest22",
    //       asset_ids: protonAssetsToSend.map(asset => asset.asset_id),
    //       memo: "Transfer NFTs to teleport",
    //     });
    //     console.log("transfer nfts", res);
    //   }
    // } catch (e) {
    //   setIsLoading(false);
    //   console.log(e);
    // }
  }

  return (
    <>
      <Header>
        <HeaderTitle>NFT Bridge</HeaderTitle>
        <SubTitle>The NFT bridge allows a user transfer their NFT assets between Ethereum blockchain and Proton.</SubTitle>
        <ContentHeader>Transfer NFTs</ContentHeader>
      </Header>

      <Container>
        {isLoading && <LoadingPage />}
        {!isLoading && <Content>
          <MessageBox>
            <MessageContent>
              {/* <p>To access the Ethereum to Proton bridge you need to switch to Eth Mainnet.</p> */}
              <br />
              {!account && <Button
                smallSize={true}
                onClick={onWalletAction}
              >
                Connect Wallet
              </Button>}

              <p>{account ? account : "Click on the button above to connect to your metamask accout."}</p>

              <br />
              {account && <Button
                smallSize={true}
                onClick={onWalletAction}
              >
                Disconnect Wallet
              </Button>}

              {!account && <InputField
                placeholder="0x0000000000000000000000000000000000000000"
                value={targetAddress}
                setValue={setTargetAddress}
                mb="16px"
              />}
            </MessageContent>
          </MessageBox>

          <Switch>
            {transDir === TRANSFER_DIR.ETH_TO_PROTON && (
              <CurrentDir>Ethereum to Proton</CurrentDir>
            )}

            {transDir === TRANSFER_DIR.PROTON_TO_ETH && (
              <CurrentDir>Proton to Ethereum</CurrentDir>
            )}

            <div onClick={() => setTransDir(transDir === TRANSFER_DIR.ETH_TO_PROTON ? TRANSFER_DIR.PROTON_TO_ETH : TRANSFER_DIR.ETH_TO_PROTON)}>
              <Image
                width="36px"
                height="36px"
                alt="swap_button"
                src="/swap-vert-blue.svg"
                className={transDir === TRANSFER_DIR.ETH_TO_PROTON ? 'rotate-90 cursor-pointer' : 'rotate-270 cursor-pointer'}
              />
            </div>

            {transDir === TRANSFER_DIR.ETH_TO_PROTON && (
              <NextDir>Proton to Ethereum</NextDir>
            )}

            {transDir === TRANSFER_DIR.PROTON_TO_ETH && (
              <NextDir>Ethereum to Proton</NextDir>
            )}
          </Switch>

          <NftBox>
            <NftList>
              {transDir==TRANSFER_DIR.ETH_TO_PROTON && ethAssetsOrigin.map((ethAsset: ETH_ASSET, idx) => (
                <EthNft
                  data={ethAsset}
                  selectedNft={selectedEthNft}
                  setSelectedNft={setSelectedEthNft}
                  key={idx}
                />
              ))}

              {transDir==TRANSFER_DIR.PROTON_TO_ETH && protonAssetsOrigin.map((asset: Asset, idx) => (
                <ProtonNft
                  data={asset}
                  selectedNft={selectedProtonNft}
                  setSelectedNft={setSelectedProtonNft}
                  key={idx}
                />
              ))}
            </NftList>

            <NftExchangeBtnBox>
              <Image
                width="38px"
                height="38px"
                alt="exchange_button"
                src="/right-arrow.svg"
                className="cursor-pointer"
                style={{marginBottom: 20}}
                onClick={()=>onExchange(true)}
              />
              <Image
                width="38px"
                height="38px"
                alt="exchange_button"
                src="/left-arrow.svg"
                className="cursor-pointer"
                onClick={()=>onExchange(false)}
              />
            </NftExchangeBtnBox>
            
            <NftList>
              {transDir==TRANSFER_DIR.ETH_TO_PROTON && ethAssetsToSend.map((ethAsset: ETH_ASSET, idx) => (
                  <EthNft
                    data={ethAsset}
                    selectedNft={selectedEthNft}
                    setSelectedNft={setSelectedEthNft}
                    key={idx}
                  />
                ))
              }

              {transDir==TRANSFER_DIR.PROTON_TO_ETH && protonAssetsToSend.map((asset: Asset, idx) => (
                  <ProtonNft
                    data={asset}
                    selectedNft={selectedProtonNft}
                    setSelectedNft={setSelectedProtonNft}
                    key={idx}
                  />
                ))
              }
            </NftList>
          </NftBox>

          <div style={{display: 'flex', justifyContent: 'end', padding: '0 20px 20px'}}>
            <Button
              smallSize={true}
              onClick={handleTransfer}
            >
              Transfer
            </Button>
          </div>
        </Content>}
      </Container>
    </>
  )
}

export default NftBridge;
