import { useState, useEffect } from 'react';
import { useModalContext, SelectAssetsModalProps } from '../Provider';
import { ETH_ASSET, getNfts, NftType } from '../../services/ethereum';
import { Asset, getAllUserAssetsByTemplate } from '../../services/assets';
import proton from '../../services/proton-rpc';
import {
  Background,
  ModalBox,
  Section,
  CloseIconContainer,
  Title,
  HalfButton,
  Input,
  MagnifyingIconButton,
  InputContainer,
} from './Modal.styled';
import { EthNft, ProtonNft } from '../NftBridge/Nft';
import { ReactComponent as CloseIcon } from '../../public/close.svg';
import LoadingPage from '../LoadingPage';
import { ReactComponent as MagnifyingIcon } from '../../public/icon-light-search-24-px.svg';

export const SelectAssetsModal = (): JSX.Element => {
  const { closeModal, modalProps } = useModalContext();

  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ethAssets, setEthAssets] = useState<ETH_ASSET[]>([]);
  const [protonAssets, setProtonAssets] = useState<Asset[]>([]);
  const [filteredEthAssets, setFilteredEthAssets] = useState<ETH_ASSET[]>([]);
  const [filteredProtonAssets, setFilteredProtonAssets] = useState<Asset[]>([]);
  const [selectedEthNft, setSelectedEthNft] = useState<ETH_ASSET | null>(null);
  const [selectedProtonNft, setSelectedProtonNft] = useState<Asset | null>(
    null
  );
  const [searchText, setSearchText] = useState<string>('');

  const {
    ethToProton,
    owner,
    nftType,
    selectedNfts,
    setSelectedNfts,
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
    filterEthNFTs(nfts);
    setIsLoading(false);
  };

  const fetchProtonAssets = async () => {
    if (owner) {
      setProtonAssets([]);
      setIsLoading(true);

      try {
        const templates = await proton.getTemplatesRegisteredInBridge();
        const assetsArray = await Promise.all<Asset[][]>(
          templates.map((_) => getAllUserAssetsByTemplate(owner, _.template_id))
        );
        // support assets that created by bridge.
        let assets: Asset[] = [];
        assets = assets.concat(...assetsArray);
        setProtonAssets(assets);
        setFilteredProtonAssets(assets);
        setIsLoading(false);
      } catch (e) {
        console.warn(e.message);
        setIsLoading(false);
      }
    }
  };

  const filterEthNFTs = (nfts: null | ETH_ASSET[]) => {
    const filter = searchText.trim().toLowerCase();
    const _ethAssets = (nfts ?? ethAssets).filter((el) => {
      const matchesName =
        el.attributes.name?.trim()?.toLowerCase()?.indexOf(filter) > -1;
      const matchesType = el.tokenType?.toLowerCase() == nftType;
      let matchesContract = true;
      if (selectedNfts.length) {
        if (
          el.contractAddress.toLowerCase() !=
          selectedNfts[0].contractAddress.toLowerCase()
        ) {
          matchesContract = false;
        } else if (
          selectedNfts.find(
            (_) => _.tokenId.toLowerCase() == el.tokenId.toLowerCase()
          )
        ) {
          matchesContract = false;
        }
      }
      return matchesName && matchesType && matchesContract;
    });
    setFilteredEthAssets(_ethAssets);
  };

  const filterProtonNFTs = () => {
    const filter = searchText.trim().toLowerCase();
    const _protonAssets = protonAssets.filter((el) => {
      const matchesName = el.name?.trim()?.toLowerCase()?.indexOf(filter) > -1;
      const matchesCollection =
        el.collection?.name?.trim()?.toLowerCase()?.indexOf(filter) > -1;
      return matchesName || matchesCollection;
    });
    setFilteredProtonAssets(_protonAssets);
  };

  return (
    <Background>
      {!isLoading ? (
        <ModalBox>
          <Section>
            <Title>
              Select&nbsp;
              {ethToProton &&
                (nftType === NftType.ERC_721 ? 'ERC721' : 'ERC1155')}
              {!ethToProton && 'Atomic Assets'}
            </Title>
            <CloseIconContainer role="button" onClick={closeModal}>
              <CloseIcon />
            </CloseIconContainer>
          </Section>

          <InputContainer>
            <Input
              required
              type="text"
              placeholder="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <MagnifyingIconButton
              style={{
                paddingLeft: 15,
                paddingRight: 15,
                background: '#752eeb',
                height: '100%',
                borderRadius: '0 7px 7px 0',
              }}
              onClick={() => {
                ethToProton ? filterEthNFTs(null) : filterProtonNFTs();
              }}>
              <MagnifyingIcon />
            </MagnifyingIconButton>
          </InputContainer>

          {ethToProton &&
            (filteredEthAssets.length ? (
              filteredEthAssets.map((ethAsset: ETH_ASSET, idx) => (
                <EthNft
                  data={ethAsset}
                  selectedNft={selectedEthNft}
                  setSelectedNft={setSelectedEthNft}
                  key={idx}
                />
              ))
            ) : (
              <div style={{ textAlign: 'center', fontSize: 20 }}>
                No NFTs found
              </div>
            ))}

          {!ethToProton &&
            (filteredProtonAssets.length ? (
              filteredProtonAssets.map((asset: Asset, idx) => (
                <ProtonNft
                  data={asset}
                  selectedNft={selectedProtonNft}
                  setSelectedNft={setSelectedProtonNft}
                  key={idx}
                />
              ))
            ) : (
              <div style={{ textAlign: 'center', fontSize: 20 }}>
                No NFTs found
              </div>
            ))}
          <br />

          <HalfButton
            margin="20px 0 0"
            disabled={
              (ethToProton && !selectedEthNft) ||
              (!ethToProton && !selectedProtonNft)
            }
            onClick={() => {
              setSelectedNfts(ethToProton ? selectedEthNft : selectedProtonNft);
              closeModal();
            }}>
            Add
          </HalfButton>
        </ModalBox>
      ) : (
        <LoadingPage></LoadingPage>
      )}
    </Background>
  );
};
