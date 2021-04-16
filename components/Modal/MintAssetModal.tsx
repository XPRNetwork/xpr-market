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
  MintFeeLabel,
} from './Modal.styled';
import { PRICE_OF_RAM_IN_XPR } from '../../utils/constants';
import ProtonSDK from '../../services/proton';
import proton from '../../services/proton-rpc';
import { ReactComponent as CloseIcon } from '../../public/close.svg';

export const MintAssetModal = (): JSX.Element => {
  const {
    currentUser: { actor },
  } = useAuthContext();
  const { closeModal, modalProps } = useModalContext();
  const {
    templateId,
    maxEditionSize,
    editionSize,
    collectionName,
    fetchPageData,
  } = modalProps as MintAssetModalProps;
  const [amount, setAmount] = useState<string>('');
  const [mintFee, setMintFee] = useState<string>('');
  const [accountRam, setAccountRam] = useState<number>(0);
  const [conversionRate, setConversionRate] = useState<number>(0);
  const possibleMintAmount = maxEditionSize - editionSize;
  const maxMintAmountForSession =
    possibleMintAmount < 50 ? possibleMintAmount : 50;
  const maxMintMessage = `${maxMintAmountForSession} max${
    maxMintAmountForSession === 50 ? ' per session' : ''
  }`;

  useEffect(() => {
    (async () => {
      const { max, used } = await proton.getAccountRam(actor);
      const rate = await proton.getXPRtoXUSDCConversionRate();
      setAccountRam(max - used);
      setConversionRate(rate);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const requiredRam = parseInt(amount) * 151 - accountRam;
      if (requiredRam <= 0) {
        setMintFee('0.00 XUSDC');
      } else {
        const calculatedFee =
          PRICE_OF_RAM_IN_XPR * requiredRam * conversionRate;
        const mintFee = isNaN(calculatedFee)
          ? '0.00'
          : Math.ceil(calculatedFee * 100) / 100;
        setMintFee(`${mintFee} XUSDC`);
      }
    })();
  }, [amount]);

  const mintNfts = async () => {
    const fee = mintFee.split(' ')[0];
    const mint_fee = isNaN(parseFloat(fee)) ? 0 : parseFloat(fee);

    const result = await ProtonSDK.mintAssets({
      author: actor,
      collection_name: collectionName,
      template_id: templateId,
      mint_amount: parseInt(amount),
      mint_fee,
    });

    if (result.success) {
      closeModal();
      setTimeout(() => {
        fetchPageData();
      }, 1000);
    }
  };

  const handleBackgroundClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

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
          You have minted {editionSize} out of a total edition size of{' '}
          {maxEditionSize}.
          <br />
          Enter an amount to mint ({maxMintMessage}).
        </Description>
        <InputField
          inputType="number"
          min={1}
          max={50}
          step={1}
          mt="8px"
          value={amount}
          setValue={setAmount}
          placeholder="Enter amount"
          submit={parseInt(amount) > 50 ? null : mintNfts}
          checkIfIsValid={(input) => {
            const numberInput = parseInt(input as string);
            const isValid =
              !isNaN(numberInput) && numberInput >= 1 && numberInput <= 50;
            const errorMessage = `You can mint 1-${maxMintAmountForSession} assets in this mint session`;
            return {
              isValid,
              errorMessage,
            };
          }}
        />
        <MintFeeLabel>
          <span>Mint Fee</span>
          <span>{mintFee}</span>
        </MintFeeLabel>
        <HalfButton
          onClick={mintNfts}
          margin="0 0 20px"
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
