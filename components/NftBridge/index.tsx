import { useState, useEffect, useMemo } from 'react';
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from '@web3-react/core';
import { useToasts } from 'react-toast-notifications';
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
  InfoBox
} from './NftBridge.styled';
import { Image } from '../../styles/index.styled';
import Button from '../Button';
import { ETH_ASSET, getNfts, transferERC721ToBridge } from '../../services/ethereum';
import protonSDK from '../../services/proton';
import proton, { TeleportFees, TeleportFeesBalance } from '../../services/proton-rpc';
import { Asset, getAllUserAssetsByTemplate } from '../../services/assets';
import LoadingPage from '../LoadingPage';
import { useAuthContext } from '../Provider';
import { EthNft, ProtonNft } from './Nft';
import { useModalContext, MODAL_TYPES } from '../Provider';
import { TrackingTables } from './TrackingTables';

const TRANSFER_DIR = {
  ETH_TO_PROTON: 'ETH_TO_PROTON',
  PROTON_TO_ETH: 'PROTON_TO_ETH'
};

enum NftType {
  ERC_721 = "erc721",
  ERC_1155 = "erc1155"
};

const injected = new InjectedConnector({
  supportedChainIds: [137, 3]
});

const NftBridge = (): JSX.Element => {
  const { addToast } = useToasts();
  const { currentUser, isLoadingUser } = useAuthContext();
  const { openModal, setModalProps } = useModalContext();

  const { library, account, active, activate, deactivate, chainId } = useWeb3React();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transDir, setTransDir] = useState<string>(TRANSFER_DIR.ETH_TO_PROTON);
  const [ethAssetsOrigin, setEthAssetsOrigin] = useState<ETH_ASSET[]>([]);
  const [ethAssetsToSend, setEthAssetsToSend] = useState<ETH_ASSET[]>([]);
  const [protonAssetsOrigin, setProtonAssetsOrigin] = useState<Asset[]>([]);
  const [protonAssetsToSend, setProtonAssetsToSend] = useState<Asset[]>([]);
  const [selectedEthNft, setSelectedEthNft] = useState<ETH_ASSET | null>(null);
  const [selectedProtonNft, setSelectedProtonNft] = useState<Asset | null>(null);
  const [nftType, setNftType] = useState<NftType>(NftType.ERC_721);
  const [teleportFees, setTeleportFees] = useState<TeleportFees[]>([]);
  const [feesBalance, setFeesBalance] = useState<TeleportFeesBalance>({
    owner: "",
    balance: 0,
    reserved: 0
  });

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
    fetchEthAssets();
  }, [account]);

  useEffect(() => {
    fetchProtonAssets();
  }, [currentUser?.actor]);

  const filteredEthAssets = useMemo(() => {
    return ethAssetsOrigin.filter(el => el.tokenType?.toLowerCase() == nftType);
  }, [nftType, ethAssetsOrigin.length]);

  const filteredFees = useMemo(() => {
    if (!teleportFees.length || !chainId) {
      return {
        chainId: -1,
        port_in_fee: 0,
        port_out_fee: 0
      }
    }

    const fees = teleportFees.find(el => el.chain_id == chainId);
    if (fees) {
      return fees;
    } else {
      // return default fees
      const defaultFee = teleportFees.find(el => el.chain_id == 0);
      if (defaultFee) {
        return defaultFee;
      }

      return {
        chainId: -1,
        port_in_fee: 0,
        port_out_fee: 0
      };
    }
  }, [chainId, teleportFees]);

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

    setEthAssetsToSend([]);
    setEthAssetsOrigin([]);

    setIsLoading(true);
    const nfts = await getNfts(account);
    setEthAssetsOrigin(nfts);
    setIsLoading(false);
  }

  const fetchProtonAssets = async () => {
    if (currentUser?.actor) {
      setProtonAssetsOrigin([]);
      setProtonAssetsToSend([]);

      setIsLoading(true);

      try {
        const assets = await getAllUserAssetsByTemplate(currentUser.actor, undefined);
        // support assets that created by bridge.
        const filtered = assets.filter(el => el.collection.author == process.env.NEXT_PUBLIC_PRT_NFT_BRIDGE);
        setProtonAssetsOrigin(filtered);

        const balance = await proton.getFeesBalanceForTeleport(currentUser.actor);
        setFeesBalance(balance);

        // const outreqs = await proton.getOutReqsForTeleport();
        // console.log("---- outreqs", outreqs)

        setIsLoading(false);
      } catch (e) {
        console.warn(e.message);
        setIsLoading(false);
      }
    }
  }

  const onExchange = async (dir: boolean) => {
    if (
      (transDir == TRANSFER_DIR.ETH_TO_PROTON && !selectedEthNft) ||
      (transDir == TRANSFER_DIR.PROTON_TO_ETH && !selectedProtonNft)
    ) return;

    if (dir && transDir == TRANSFER_DIR.ETH_TO_PROTON) {
      // Only 1 nft is available
      if (ethAssetsToSend.length) {
        addToast('Currently only 1 NFT can be teleported.', { appearance: 'info', autoDismiss: true });
        return;
      }

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
      // Only 1 nft is available
      if (protonAssetsToSend.length) {
        addToast('Currently only 1 NFT can be teleported.', { appearance: 'info', autoDismiss: true });
        return;
      }
      
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
    if (!teleportFees.length || !feesBalance) {
      addToast('Refresh the page!', { appearance: 'warning', autoDismiss: true });
      return;
    }

    let fees = teleportFees.find(el => el.chain_id == chainId);
    if (!fees) {
      fees = teleportFees.find(el => el.chain_id == 0);
    }

    try {
      if (
        (!ethAssetsToSend.length && transDir == TRANSFER_DIR.ETH_TO_PROTON) ||
        (!protonAssetsToSend.length && transDir == TRANSFER_DIR.PROTON_TO_ETH)
      ) {
        addToast('Please select NFTs to send.', { appearance: 'info', autoDismiss: true });
        return;
      }
  
      if (!library) {
        addToast('Please connect ethereum wallet.', { appearance: 'info', autoDismiss: true });
        return;
      }
  
      if (transDir === TRANSFER_DIR.ETH_TO_PROTON) {
        // Check fee balance
        if ((feesBalance.balance - feesBalance.reserved) < fees.port_in_fee) {
          addToast('Too low balance for fee. please top up firstly!', { appearance: 'warning', autoDismiss: true });
          return;
        }

        const tokenIds = ethAssetsToSend.map((nft: ETH_ASSET) => nft.tokenId);
        const tokenContract = ethAssetsToSend[0].contractAddress;
        setIsLoading(true);
        const txPreHash = await transferERC721ToBridge(tokenContract, tokenIds[0], account, library.getSigner());
        await txPreHash.wait();
        addToast('Transfered to Ethereum NFT Bridge successfully.', { appearance: 'success', autoDismiss: true });

        setTimeout(() => {
          setModalProps((previousModalProps) => ({
            ...previousModalProps,
            ethToProton: true,
            tokenContract,
            tokenId: tokenIds[0],
            fetchPageData: fetchEthAssets
          }));
          openModal(MODAL_TYPES.CONFIRM_TELEPORT);
        }, 2000);

        setIsLoading(false);
      } else {
        // Check fee balance
        if ((feesBalance.balance - feesBalance.reserved) < fees.port_out_fee) {
          addToast('Too low balance for fee. please top up firstly!', { appearance: 'warning', autoDismiss: true });
          return;
        }

        setIsLoading(true);

        // Transfer
        const transferRes = await protonSDK.transfer({
          sender: currentUser?.actor,
          recipient: process.env.NEXT_PUBLIC_PRT_NFT_BRIDGE,
          asset_ids: protonAssetsToSend.map(asset => asset.asset_id),
          memo: "Transfer NFTs to teleport",
        });

        if (!transferRes.success) {
          addToast('Transfer failed.', { appearance: 'error', autoDismiss: true });
          setIsLoading(false);
          return;
        }
        addToast('Transfered NFTs to PRTBRIDGE successfully!', { appearance: 'success', autoDismiss: true });

        setTimeout(() => {
          let tokenContract = "0x";
          (protonAssetsToSend[0].data.contract_address as number[]).forEach(el => {
            tokenContract += el.toString(16);
          });

          let tokenId = "0x";
          (protonAssetsToSend[0].data.token_id as number[]).forEach(el => {
            tokenId += el.toString(16);
          });

          setModalProps((previousModalProps) => ({
            ...previousModalProps,
            ethToProton: false,
            tokenContract,
            tokenId,
            assetId: protonAssetsToSend[0].asset_id,
            fetchPageData: fetchProtonAssets
          }));
          openModal(MODAL_TYPES.CONFIRM_TELEPORT);
        }, 2000);

        setIsLoading(false);
      }
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  }

  return (
    <>
      <Header>
        <HeaderTitle>NFT Bridge</HeaderTitle>
        <SubTitle>The NFT bridge allows a user transfer their NFT assets between Ethereum blockchain and Proton.</SubTitle>
        <ContentHeader>Transfer NFTs</ContentHeader>
      </Header>

      <Container>
        <Content>
        {isLoading && <LoadingPage />}
        {!isLoading &&
          <>
            <MessageBox>
              <MessageContent>
                {/* <p>To access the Ethereum to Proton bridge you need to switch to Eth Mainnet.</p> */}
                {!account && <Button
                  smallSize={true}
                  onClick={onWalletAction}
                >
                  Connect Wallet
                </Button>}

                <p>{account ? account : "Click on the button above to connect to your metamask accout."}</p>

                {account && <Button
                  smallSize={true}
                  onClick={onWalletAction}
                >
                  Disconnect Wallet
                </Button>}

                {/* {!account && <InputField
                  placeholder="0x0000000000000000000000000000000000000000"
                  value={targetAddress}
                  setValue={setTargetAddress}
                  mb="16px"
                />} */}
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

            <InfoBox>
              {transDir === TRANSFER_DIR.ETH_TO_PROTON && <div>
                <span>Token Type: &nbsp;</span>
                <span>{nftType.toUpperCase()}</span>
              </div>}
              <div>
                <span>Fee Balance: &nbsp;</span>
                <span>{(feesBalance?.balance - feesBalance?.reserved).toFixed(4)} XPR</span>
              </div>
              <div>
                <span>Fee: &nbsp;</span>
                {transDir == TRANSFER_DIR.ETH_TO_PROTON && <span>{(filteredFees?.port_in_fee).toFixed(4)} XPR</span>}
                {transDir == TRANSFER_DIR.PROTON_TO_ETH && <span>{(filteredFees?.port_out_fee).toFixed(4)} XPR</span>}
              </div>
            </InfoBox>

            <NftBox>
              <NftList>
                {transDir==TRANSFER_DIR.ETH_TO_PROTON && (filteredEthAssets.length ? filteredEthAssets.map((ethAsset: ETH_ASSET, idx) => (
                  <EthNft
                    data={ethAsset}
                    selectedNft={selectedEthNft}
                    setSelectedNft={setSelectedEthNft}
                    key={idx}
                  />
                )) : (
                  <div style={{padding: 20}}>No NFTs</div>
                ))}

                {transDir==TRANSFER_DIR.PROTON_TO_ETH && (protonAssetsOrigin.length ? protonAssetsOrigin.map((asset: Asset, idx) => (
                  <ProtonNft
                    data={asset}
                    selectedNft={selectedProtonNft}
                    setSelectedNft={setSelectedProtonNft}
                    key={idx}
                  />
                )) : (
                  <div style={{padding: 20}}>No NFTs</div>
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
          </>}
        </Content>

        <TrackingTables fetchEthAssets={fetchEthAssets} />
      </Container>
    </>
  )
}

export default NftBridge;
