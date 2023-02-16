import { useModalContext, TopupModalProps } from '../Provider';
import {
  Background,
  ModalBox,
  Section,
  CloseIconContainer,
  Title,
  Description,
  Column,
  HalfButton,
} from './Modal.styled';
import { useWindowSize } from '../../hooks';
import { ReactComponent as CloseIcon } from '../../public/close.svg';

export const TopupModal = (): JSX.Element => {
  const { closeModal, modalProps } = useModalContext();
  const { fee, fetchPageData } = modalProps as TopupModalProps;
  const { isMobile } = useWindowSize();

  const confirm = () => {
    fetchPageData();
    closeModal();
  };

  return (
    <Background>
      <ModalBox>
        <Section>
          <Title>Transfer Fee</Title>
          <CloseIconContainer role="button" onClick={closeModal}>
            <CloseIcon />
          </CloseIconContainer>
        </Section>
        <Description>Send {fee} XPR to transfer</Description>
        <Column>
          <HalfButton fullWidth={isMobile} onClick={confirm} margin="0">
            Confirm
          </HalfButton>
        </Column>
      </ModalBox>
    </Background>
  );
};
