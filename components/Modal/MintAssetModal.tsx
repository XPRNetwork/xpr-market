import { useState, MouseEvent, useEffect } from 'react';
import {
  useAuthContext,
  useModalContext,
  MintAssetModalProps,
} from '../Provider';
import InputField from '../InputField';
import {
  Background,
  ModalBox,
  Section,
  CloseIconContainer,
  Title,
  Description,
  HalfButton,
  FeeLabel,
} from './Modal.styled';
import { RAM_COSTS, SHORTENED_TOKEN_PRECISION } from '../../utils/constants';
import { calculateFee } from '../../utils';
import ProtonSDK from '../../services/proton';
import { ReactComponent as CloseIcon } from '../../public/close.svg';

export const MintAssetModal = (): JSX.Element => {
  const {
    currentUser: { actor },
  } = useAuthContext();
  const { closeModal, modalProps } = useModalContext();
  const {
    templateId,
    maxSupply,
    issuedSupply,
    collectionName,
    accountRam,
    conversionRate,
    fetchPageData,
    setIsModalWithFeeOpen,
  } = modalProps as MintAssetModalProps;
  const [amount, setAmount] = useState<string>('');
  const [mintFee, setMintFee] = useState<number>(0);
  const possibleMintAmount = maxSupply - issuedSupply;
  const maxMintAmountForSession =
    possibleMintAmount < 50 ? possibleMintAmount : 50;
  const maxMintMessage = `${maxMintAmountForSession} max${
    maxMintAmountForSession === 50 ? ' per session' : ''
  }`;

  useEffect(() => {
    const numAssets = parseInt(amount);
    const fee = calculateFee({
      numAssets: isNaN(numAssets) ? 0 : numAssets,
      accountRam,
      ramCost: RAM_COSTS.MINT_ASSET,
      conversionRate,
    });
    setMintFee(isNaN(fee) ? 0 : fee);
  }, [amount, accountRam, conversionRate]);

  const mintNfts = async () => {
    try {
      const result = await ProtonSDK.mintAssets({
        author: actor,
        collection_name: collectionName,
        template_id: templateId,
        mint_amount: parseInt(amount),
        mint_fee: mintFee,
      });

      if (result.success) {
        closeModal();
        setIsModalWithFeeOpen(false);
        setTimeout(() => {
          fetchPageData();
        }, 1000);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleBackgroundClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const getFee = () =>
    mintFee && mintFee !== 0 ? (
      <FeeLabel>
        <span>Mint Fee</span>
        <span>{mintFee.toFixed(SHORTENED_TOKEN_PRECISION)} XUSDC</span>
      </FeeLabel>
    ) : null;

  return (
    <Background onClick={handleBackgroundClick}>
      <ModalBox>
        <Section>
          <Title>Mint NFTs</Title>
          <CloseIconContainer role="button" onClick={closeModal}>
            <CloseIcon />
          </CloseIconContainer>
        </Section>
        <Description>
          You have minted {issuedSupply} out of a total edition size of{' '}
          {maxSupply}.
          <br />
          Enter an amount to mint ({maxMintMessage}).
        </Description>
        <InputField
          inputType="number"
          min={1}
          max={maxMintAmountForSession}
          step={1}
          mt="8px"
          value={amount}
          setValue={setAmount}
          placeholder="Enter amount"
          submit={parseInt(amount) > maxMintAmountForSession ? null : mintNfts}
          checkIfIsValid={(input) => {
            const numberInput = parseInt(input as string);
            const isValid =
              !isNaN(numberInput) &&
              numberInput >= 1 &&
              numberInput <= maxMintAmountForSession;
            const errorMessage = `You can mint 1-${maxMintAmountForSession} assets in this mint session`;
            return {
              isValid,
              errorMessage,
            };
          }}
        />
        {getFee()}
        <HalfButton
          onClick={mintNfts}
          margin={mintFee !== 0 ? '0 0 20px' : '24px 0 20px'}
          disabled={
            isNaN(parseInt(amount)) ||
            parseInt(amount) > maxMintAmountForSession
          }>
          Mint NFTs
        </HalfButton>
      </ModalBox>
    </Background>
  );
};
