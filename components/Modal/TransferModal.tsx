import { MouseEvent, useState } from 'react';
import {
  useAuthContext,
  useModalContext,
  TransferOrBurnNFTModalProps,
} from '../Provider';
import {
  Background,
  ModalBox,
  Section,
  CloseIconContainer,
  Title,
  Description,
  ErrorMessage,
  Column,
  HalfButton,
} from './Modal.styled';
import InputField from '../InputField';
import { useWindowSize } from '../../hooks';
import ProtonSDK from '../../services/proton';
import { ReactComponent as CloseIcon } from '../../public/close.svg';

export const TransferModal = (): JSX.Element => {
  const { currentUser } = useAuthContext();
  const { closeModal, modalProps } = useModalContext();
  const {
    assetId,
    templateMint,
    fetchPageData,
  } = modalProps as TransferOrBurnNFTModalProps;
  const [recipient, setRecipient] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { isMobile } = useWindowSize();

  const transfer = async () => {
    try {
      if (recipient.length == 0 || recipient.length > 12) {
        return;
      }
      const res = await ProtonSDK.transfer({
        sender: currentUser ? currentUser.actor : '',
        recipient: recipient,
        asset_id: assetId,
      });

      if (!res.success && !res.error.includes('Modal closed')) {
        throw new Error(res.error);
      }

      if (res.success) {
        fetchPageData();
        closeModal();
      }
    } catch (e) {
      setError(e.message);
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
          <Title>Transfer NFT</Title>
          <CloseIconContainer role="button" onClick={closeModal}>
            <CloseIcon />
          </CloseIconContainer>
        </Section>
        <Description>
          You can transfer NFTs from your account to another.
        </Description>
        <Column>
          <InputField value={'#' + templateMint} disabled mb="16px" />
          <InputField
            value={recipient}
            setValue={setRecipient}
            setFormError={setError}
            placeholder="Receiver name"
            mb="12px"
            checkIfIsValid={(input) => {
              const isValid = (input as string).length < 13;
              const errorMessage =
                "Error: Recipient's name must be 12 characters or less.";
              return {
                isValid,
                errorMessage,
              };
            }}
          />
          <HalfButton fullWidth={isMobile} onClick={transfer} margin="12px 0">
            Transfer
          </HalfButton>
          <ErrorMessage>{error}</ErrorMessage>
        </Column>
      </ModalBox>
    </Background>
  );
};
