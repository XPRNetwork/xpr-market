import { MouseEvent } from 'react';
import { useAuthContext, useModalContext } from '../Provider';
import {
  Background,
  ModalBox,
  Section,
  CloseIconContainer,
  Title,
  Description,
  HalfButton,
} from './Modal.styled';
import InputField from '../InputField';
import { ReactComponent as CloseIcon } from '../../public/close.svg';
import { useWindowSize } from '../../hooks';

export const ReportModal = (): JSX.Element => {
  const {
    currentUser: { actor },
  } = useAuthContext();
  const { isMobile } = useWindowSize();
  const { closeModal, modalProps } = useModalContext();

  const handleBackgroundClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <Background onClick={handleBackgroundClick}>
      <ModalBox>
        <Section>
          <Title>Report</Title>
          <CloseIconContainer role="button" onClick={closeModal}>
            <CloseIcon />
          </CloseIconContainer>
        </Section>
        <Description>
          Are you sure you want to burn this NFT? This action will permanently
          delete the NFT and cannot be undone.
        </Description>
        <InputField value={'Report'} disabled mb="24px" />
        <HalfButton
          fullWidth={isMobile}
          color="#f94e6c"
          hoverColor="#ff778e"
          margin="0 0 12px"
          onClick={() => console.log('report')}>
          Report
        </HalfButton>
      </ModalBox>
    </Background>
  );
};
