import { useState, useEffect } from 'react';
import { useWeb3 } from "@3rdweb/hooks" 
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
  NftName,
  NftItem
} from './NftBridge.styled';
import { Image } from '../../styles/index.styled';
import Button from '../Button';
import { ETH_ASSET, getNfts } from '../../services/eth-assets';
import LoadingPage from '../LoadingPage';

const TRANSFER_DIR = {
  ETH_TO_PROTON: 'ETH_TO_PROTON',
  PROTON_TO_ETH: 'PROTON_TO_ETH'
};

interface NFTProps {
  data: ETH_ASSET,
  selectedNft: ETH_ASSET;
  setSelectedNft: (nft: ETH_ASSET) => void;
};

const NFT = (props: NFTProps) => {
  return (
    <NftItem
      selected={props.selectedNft?.contractAddress == props.data.contractAddress && props.selectedNft?.tokenId == props.data.tokenId}
      onClick={() => props.setSelectedNft(props.data)}
    >
      <Image
        src={props.data.attributes.image}
        width="50"
        height='50'
        style={{marginRight: 20}}
      />
      <NftName>{props.data.attributes.name}</NftName>
    </NftItem>
  )
}

const NftBridge = (): JSX.Element => {
  const { connectWallet, disconnectWallet, address } = useWeb3();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transDir, setTransDir] = useState<string>(TRANSFER_DIR.ETH_TO_PROTON);
  const [ethAssetsOrigin, setEthAssetsOrigin] = useState<ETH_ASSET[]>([]);
  const [ethAssetsToSend, setEthAssetsToSend] = useState<ETH_ASSET[]>([]);
  const [selectedNft, setSelectedNft] = useState<ETH_ASSET | null>(null);

  useEffect(() => {
    onSelectNft();
  }, [address]);

  const onWalletAction = () => {
    if (address) {
      disconnectWallet();
    } else {
      connectWallet("injected");
    }
  }

  const onSelectNft = async () => {
    if (!address) {
      return;
    }

    setIsLoading(true);
    const nfts = await getNfts(address);
    console.log(nfts);
    setEthAssetsOrigin(nfts);
    setIsLoading(false);
  }

  const onExchange = async (dir: boolean) => {
    if (!selectedNft) return;

    if (dir) {
      const index = ethAssetsOrigin.findIndex((nft: ETH_ASSET) => nft.contractAddress == selectedNft.contractAddress && nft.tokenId == selectedNft.tokenId);
      if (index > -1) {
        setEthAssetsOrigin(
          ethAssetsOrigin.filter((nft: ETH_ASSET) => nft.contractAddress !== selectedNft.contractAddress && nft.tokenId !== selectedNft.tokenId)
        );
  
        ethAssetsToSend.push(selectedNft);
        setEthAssetsToSend(ethAssetsToSend);
  
        setSelectedNft(null);
      }
    } else {
      const index = ethAssetsToSend.findIndex((nft: ETH_ASSET) => nft.contractAddress == selectedNft.contractAddress && nft.tokenId == selectedNft.tokenId);
      if (index > -1) {
        setEthAssetsToSend(
          ethAssetsToSend.filter((nft: ETH_ASSET) => nft.contractAddress !== selectedNft.contractAddress && nft.tokenId !== selectedNft.tokenId)
        );

        ethAssetsOrigin.push(selectedNft);
        setEthAssetsOrigin(ethAssetsOrigin);

        setSelectedNft(null);
      }
    }
  }

  const handleTransfer = () => {
    if (!ethAssetsToSend.length) {
      alert("Please select NFTs");
      return;
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
        {isLoading && <LoadingPage />}
        {!isLoading && <Content>
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

          <MessageBox>
            <MessageContent>
              {/* <p>To access the Ethereum to Proton bridge you need to switch to Eth Mainnet.</p> */}
              <br />
              {!address && <Button
                smallSize={true}
                onClick={() => onWalletAction()}
              >
                Connect Wallet
              </Button>}
              <p>
                {address ? address : "Click on the button above to connect to your metamask accout."}
              </p>
              <br />
              {address && <Button
                smallSize={true}
                onClick={() => onWalletAction()}
              >
                Disconnect Wallet
              </Button>}
            </MessageContent>
          </MessageBox>

          <NftBox>
            <NftList>
              {ethAssetsOrigin.map((ethAsset: ETH_ASSET, idx) => (
                <NFT
                  data={ethAsset}
                  selectedNft={selectedNft}
                  setSelectedNft={setSelectedNft}
                  key={idx}
                />
              ))}
            </NftList>

            <NftExchangeBtnBox>
              <Image
                width="18px"
                height="18px"
                alt="exchange_button"
                src="/right-arrow.svg"
                className="cursor-pointer"
                style={{marginBottom: 20}}
                onClick={()=>onExchange(true)}
              />
              <Image
                width="18px"
                height="18px"
                alt="exchange_button"
                src="/left-arrow.svg"
                className="cursor-pointer"
                onClick={()=>onExchange(false)}
              />
            </NftExchangeBtnBox>
            
            <NftList>
              {
                ethAssetsToSend.map((ethAsset: ETH_ASSET, idx) => (
                  <NFT
                    data={ethAsset}
                    selectedNft={selectedNft}
                    setSelectedNft={setSelectedNft}
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
