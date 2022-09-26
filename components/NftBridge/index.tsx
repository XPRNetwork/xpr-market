import { useState, useEffect, useMemo } from 'react';
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
  ChainBtn,
  MessageBox,
  NftBox,
  InfoBox,
  TableContent,
  Tabs,
  Tab,
  AddNFTBtn
} from './NftBridge.styled';
import { Image } from '../../styles/index.styled';
import InputField from '../InputField';
import Button from '../Button';
import { ETH_ASSET, getNfts, transferERC721ToBridge, transferERC1155ToBridge } from '../../services/ethereum';
import protonSDK from '../../services/proton';
import proton, { TeleportFees, TeleportFeesBalance } from '../../services/proton-rpc';
import { Asset, getAllUserAssetsByTemplate } from '../../services/assets';
import Spinner from '../Spinner';
import { useAuthContext } from '../Provider';
import { EthNft, ProtonNft } from './Nft';
import { useModalContext, MODAL_TYPES } from '../Provider';
import { TrackingTables } from './TrackingTables';
import { nftBridgeOracle } from '../../utils/constants';
import { getFromApi } from '../../utils/browser-fetch';

const TRANSFER_DIR = {
  ETH_TO_PROTON: 'ETH_TO_PROTON',
  PROTON_TO_ETH: 'PROTON_TO_ETH'
};

enum NftType {
  ERC_721 = "erc721",
  ERC_1155 = "erc1155"
};

const NftBridge = (): JSX.Element => {
  const { addToast } = useToasts();
  const { currentUser } = useAuthContext();
  const { openModal, setModalProps } = useModalContext();

  const { library, account, active, activate, deactivate, chainId } = useWeb3React();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transDir, setTransDir] = useState<string>(TRANSFER_DIR.ETH_TO_PROTON);
  const [advancedAddr, setAdvancedAddr] = useState<string>("");
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
    (async () => {
      const fees = await proton.getTeleportFees();
      setTeleportFees(fees);
    })();
  }, []);

  useEffect(() => {
    fetchEthAssets();
  }, [account]);

  useEffect(() => {
    fetchProtonAssets();
  }, [currentUser?.actor]);

  useEffect(() => {
    setEthAssetsOrigin(ethAssetsOrigin.concat(ethAssetsToSend));
    setEthAssetsToSend([]);
  }, [nftType]);

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

  const disconnectWallet = () => {
    if (active) {
      deactivate();
      localStorage.clear();
      return;
    }
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

  const checkOracle = async () => {
    try {
      await getFromApi(
        nftBridgeOracle,
      );
      return true;
    } catch (err) {
      return false;
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
    const oracleStatus = await checkOracle();
    if (!oracleStatus) {
      addToast('Oracle is down', { appearance: 'warning', autoDismiss: true });
      return;
    }

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
        if (nftType == NftType.ERC_721) {
          const txPreHash = await transferERC721ToBridge(tokenContract, tokenIds[0], account, library.getSigner());
          await txPreHash.wait();
        } else {
          const txPreHash = await transferERC1155ToBridge(tokenContract, tokenIds[0], account, 1, library.getSigner());
          await txPreHash.wait();
        }
        
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
        addToast('Transfered NFTs to PRTBRIDGE', { appearance: 'success', autoDismiss: true });

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
      <Container>
        <Header>
          <HeaderTitle>NFT Bridge</HeaderTitle>
          <SubTitle>The NFT bridge allows a user transfer their NFT assets between Ethereum blockchain and Proton.</SubTitle>
        </Header>

        <Content>
          <ContentHeader>Transfer NFTs</ContentHeader>
          <MessageBox>
            <>
              {account ?
              <div style={{display: 'flex', justifyContent: 'center'}}>
                <span style={{marginRight: 20, wordBreak: 'break-all'}}>{account}</span>
                <Image width='24px' height='24px' src='/close.svg' color='#752EEB' onClick={()=>disconnectWallet()} />
              </div> : <p>Click on the button below to connect to your Ethereum wallet.</p>}
            </>

            {!account && <Button
              smallSize={true}
              onClick={()=>openModal(MODAL_TYPES.SELECT_WALLET)}
            >
              Connect Wallet
            </Button>}

            <InputField
              mt="16px"
              value={advancedAddr}
              setValue={setAdvancedAddr}
              placeholder="Add address"
            />
          </MessageBox>

          <Switch>
            <span style={{order: 1}}>From</span>
            <ChainBtn isFrom={transDir === TRANSFER_DIR.ETH_TO_PROTON}>
              <Image
                width="10px"
                height='15px'
                alt="swap_button"
                src="/ethereum.png"
              />
              <span>Ethereum</span>
            </ChainBtn>

            <div onClick={() => setTransDir(transDir === TRANSFER_DIR.ETH_TO_PROTON ? TRANSFER_DIR.PROTON_TO_ETH : TRANSFER_DIR.ETH_TO_PROTON)} style={{order: 3}}>
              <Image
                width="36px"
                height="36px"
                alt="swap_button"
                src="/swap-vert-blue.svg"
                className={transDir === TRANSFER_DIR.ETH_TO_PROTON ? 'rotate-90 cursor-pointer' : 'rotate-270 cursor-pointer'}
              />
            </div>

            <span style={{order: 4, marginLeft: 20}}>To</span>
            <ChainBtn isFrom={transDir !== TRANSFER_DIR.ETH_TO_PROTON}>
              <div style={{borderRadius: '50%', border: '1px solid #752EEB', width: 16, height: 16, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Image
                  width="10px"
                  height='10px'
                  alt="swap_button"
                  src="/proton.svg"
                />
              </div>
              <span>Proton</span>
            </ChainBtn>
          </Switch>

          {isLoading && <div style={{display: 'flex', justifyContent: 'center'}}>
            <Spinner />
          </div>}

          {!isLoading &&
          <>
            <TableContent>
              <AddNFTBtn>
                <Image
                  width='24px'
                  height='24px'
                  src='/plus-icon.png'
                />
                <span style={{marginLeft: 10}}>Add NFT</span>
              </AddNFTBtn>

              <Tabs>
                {transDir === TRANSFER_DIR.ETH_TO_PROTON && <>
                  <Tab
                    selected={nftType === NftType.ERC_721}
                    onClick={()=>setNftType(NftType.ERC_721)}
                  >
                    ERC721
                  </Tab>
                  <Tab
                    selected={nftType === NftType.ERC_1155}
                    onClick={()=>setNftType(NftType.ERC_1155)}
                  >
                    ERC1155
                  </Tab></>
                }

                {transDir === TRANSFER_DIR.PROTON_TO_ETH && <Tab
                  selected={true}
                  >
                    Atomic Assets
                  </Tab>
                }
              </Tabs>
            </TableContent>

            <NftBox>
              {transDir==TRANSFER_DIR.ETH_TO_PROTON && (filteredEthAssets.length ? filteredEthAssets.map((ethAsset: ETH_ASSET, idx) => (
                <EthNft
                  data={ethAsset}
                  selectedNft={selectedEthNft}
                  setSelectedNft={setSelectedEthNft}
                  key={idx}
                />
              )) : (
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
                  <Image width='134px' height='106px' src='/proton-pc.png' />
                  <div style={{color: '#1A1A1A', fontSize: 18, marginTop: 20}}>No NFT's added yet 😢</div>
                </div>
              ))}

              {transDir==TRANSFER_DIR.PROTON_TO_ETH && (protonAssetsOrigin.length ? protonAssetsOrigin.map((asset: Asset, idx) => (
                <ProtonNft
                  data={asset}
                  selectedNft={selectedProtonNft}
                  setSelectedNft={setSelectedProtonNft}
                  key={idx}
                />
              )) : (
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
                  <Image width='134px' height='106px' src='/proton-pc.png' />
                  <div style={{color: '#1A1A1A', fontSize: 18, marginTop: 20}}>No NFT's added yet 😢</div>
                </div>
              ))}
            </NftBox>

            <InfoBox>
              <div style={{display: 'flex', alignItems: 'center', margin: '10px 0'}}>
                <span>Fee Balance: &nbsp;</span>
                <span>{(feesBalance?.balance - feesBalance?.reserved).toFixed(4)} XPR</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', margin: '10px 0'}}>
                <span>Fee: &nbsp;</span>
                {transDir == TRANSFER_DIR.ETH_TO_PROTON && <span>{(filteredFees?.port_in_fee).toFixed(4)} XPR</span>}
                {transDir == TRANSFER_DIR.PROTON_TO_ETH && <span>{(filteredFees?.port_out_fee).toFixed(4)} XPR</span>}
              </div>
            </InfoBox>

            <div style={{width: 200 , marginTop: 10}}>
              <Button
                fullWidth
                onClick={handleTransfer}
              >
                Transfer
              </Button>
            </div>
          </>}
        </Content>

        {/* <TrackingTables fetchEthAssets={fetchEthAssets} /> */}
      </Container>
    </>
  )
}

export default NftBridge;
