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
  NftName
} from './NftBridge.styled';
import { Image } from '../../styles/index.styled';
import Button from '../Button';
import { ETH_ASSET, getNfts } from '../../services/eth-assets';

const TRANSFER_DIR = {
  ETH_TO_PROTON: 'ETH_TO_PROTON',
  PROTON_TO_ETH: 'PROTON_TO_ETH'
};

const NFT = (props: {data: ETH_ASSET}) => {
  return (
    <div style={{display: 'flex', alignItems: 'center', padding: 10}}>
      <Image
        src={props.data.attributes.image}
        width="50"
        height='50'
        style={{marginRight: 20}}
      />
      <NftName>{props.data.attributes.name}</NftName>
    </div>
  )
}

const NftBridge = (): JSX.Element => {
  const { connectWallet, disconnectWallet, address } = useWeb3();
  const [transDir, setTransDir] = useState<string>(TRANSFER_DIR.ETH_TO_PROTON);
  const [ethAssetsOrigin, setEthAssetsOrigin] = useState<ETH_ASSET[]>([]);
  const [ethAssetsToSend, setEthAssetsToSend] = useState<ETH_ASSET[]>([]);

  useEffect(() => {
    onSelectNft();
  }, [address]);

  const onWalletAction = () => {
    console.log("---------- wallet action")
    if (address) {
      disconnectWallet();
    } else {
      connectWallet("injected");
    }
  }

  const onSelectNft = async () => {
    console.log("---------- select nft")
    if (!address) {
      alert("Connect wallet");
      return;
    }
    const nfts = await getNfts(address);
    console.log(nfts);
    setEthAssetsOrigin(nfts);
  }

  const handleTransfer = () => {
    console.log("---------- transfer")
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
              <p>To access the Ethereum to Proton bridge you need to switch to Eth Mainnet.</p>
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
              {
                ethAssetsOrigin.map((ethAsset: ETH_ASSET, idx) => (
                  <NFT data={ethAsset} key={idx}/>
                ))
              }
            </NftList>

            <NftExchangeBtnBox>
              <Image
                width="18px"
                height="18px"
                alt="exchange_button"
                src="/directional-arrows.svg"
                className="cursor-pointer"
              />
            </NftExchangeBtnBox>
            
            <NftList>
              
            </NftList>
          </NftBox>

          <div style={{padding: '0 20px 20px'}}>
            <Button
              fullWidth
              smallSize={true}
              onClick={handleTransfer}
            >
              Transfer
            </Button>
          </div>
        </Content>
      </Container>
    </>
  )
}

export default NftBridge
