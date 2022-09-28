import { useState, useEffect, useMemo } from 'react';
import { useToasts } from 'react-toast-notifications';
import { useAuthContext, useModalContext, SelectAssetsModalProps } from '../Provider';
import { ETH_ASSET, getNfts, NftType } from '../../services/ethereum';
import { Asset, getAllUserAssetsByTemplate } from '../../services/assets';
import {
  Background,
  ModalBox,
  Section,
  CloseIconContainer,
  Title,
  HalfButton,
} from './Modal.styled';
import { EthNft, ProtonNft } from '../NftBridge/Nft';
import { ReactComponent as CloseIcon } from '../../public/close.svg';
import LoadingPage from '../LoadingPage';

export const SelectAssetsModal = (): JSX.Element => {
  const { closeModal, modalProps } = useModalContext();
  const { addToast } = useToasts();

  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ethAssets, setEthAssets] = useState<ETH_ASSET[]>([]);
  const [protonAssets, setProtonAssets] = useState<Asset[]>([]);
  const [selectedEthNft, setSelectedEthNft] = useState<ETH_ASSET | null>(null);
  const [selectedProtonNft, setSelectedProtonNft] = useState<Asset | null>(null);

  const {
    ethToProton,
    owner,
    nftType,
    setSelectedNft
  } = modalProps as SelectAssetsModalProps;

  useEffect(() => {
    if (error) setError('');
    
    if (ethToProton) {
      fetchEthAssets();
    } else {
      fetchProtonAssets();
    }
  }, []);

  const fetchEthAssets = async () => {
    if (!owner) {
      return;
    }

    setIsLoading(true);
    const nfts = await getNfts(owner);
    setEthAssets(nfts);
    setIsLoading(false);
  }
  
  const filteredEthAssets = useMemo(() => {
    return ethAssets.filter(el => el.tokenType?.toLowerCase() == nftType);
  }, [nftType, ethAssets.length]);

  const fetchProtonAssets = async () => {
    if (owner) {
      setProtonAssets([]);

      setIsLoading(true);

      try {
        const assets = await getAllUserAssetsByTemplate(owner, undefined);
        // support assets that created by bridge.
        const filtered = assets.filter(el => el.collection.author == process.env.NEXT_PUBLIC_PRT_NFT_BRIDGE);
        setProtonAssets(filtered);

        setIsLoading(false);
      } catch (e) {
        console.warn(e.message);
        setIsLoading(false);
      }
    }
  }

  return (
    <Background>
      {!isLoading ? <ModalBox>
        <Section>
          <Title>Select&nbsp;
            {ethToProton && (nftType === NftType.ERC_721 ? 'ERC721' : 'ERC1155')}
            {!ethToProton && 'atomic assets'}
          </Title>
          <CloseIconContainer role="button" onClick={closeModal}>
            <CloseIcon />
          </CloseIconContainer>
        </Section>

        {ethToProton && (filteredEthAssets.length ? filteredEthAssets.map((ethAsset: ETH_ASSET, idx) => (
          <EthNft
            data={ethAsset}
            selectedNft={selectedEthNft}
            setSelectedNft={setSelectedEthNft}
            key={idx}
          />
        )) : (
          <div style={{textAlign: 'center', fontSize: 20}}>No NFT</div>
        ))}

        {!ethToProton && (protonAssets.length ? protonAssets.map((asset: Asset, idx) => (
          <ProtonNft
            data={asset}
            selectedNft={selectedProtonNft}
            setSelectedNft={setSelectedProtonNft}
            key={idx}
          />
        )) : (
          <div style={{textAlign: 'center', fontSize: 20}}>No NFT</div>
        ))}
        <br />

        <HalfButton
          margin='20px 0 0'
          disabled={(ethToProton && !selectedEthNft) || (!ethToProton && !selectedProtonNft)}
          onClick={()=>{
            setSelectedNft(ethToProton ? selectedEthNft : selectedProtonNft);
            closeModal();
          }}
        >
          Add
        </HalfButton>
      </ModalBox> :
      <LoadingPage></LoadingPage>}
    </Background>
  );
};
