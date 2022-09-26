import { useState, useEffect } from 'react';
import { useToasts } from 'react-toast-notifications';
import { useAuthContext, useModalContext, SelectAssetsModalProps } from '../Provider';
import protonSDK from '../../services/proton';
import {
  Background,
  ModalBox,
  Section,
  CloseIconContainer,
  Title,
  Description,
  HalfButton,
} from './Modal.styled';
import { ReactComponent as CloseIcon } from '../../public/close.svg';
import LoadingPage from '../LoadingPage';

export const SelectAssetsModal = (): JSX.Element => {
  const { closeModal, modalProps } = useModalContext();
  const { addToast } = useToasts();

  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    ethToProton,
    owner
  } = modalProps as SelectAssetsModalProps;

  useEffect(() => {
    if (error) setError('');
  }, []);

  return (
    <Background>
      {!isLoading ? <ModalBox>
        <Section>
          <Title>Select NFT</Title>
          <CloseIconContainer role="button" onClick={closeModal}>
            <CloseIcon />
          </CloseIconContainer>
        </Section>
      </ModalBox> :
      <LoadingPage></LoadingPage>}
    </Background>
  );
};
