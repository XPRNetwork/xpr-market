import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { connectors } from "../../services/ethereum";
import { useModalContext } from '../Provider';
import {
  Background,
  ModalBox,
  Section,
  CloseIconContainer,
  Title,
  BtnLabel,
  ModalButton
} from './Modal.styled';
import { useWindowSize } from '../../hooks';
import { Image } from '../../styles/index.styled';
import { ReactComponent as CloseIcon } from '../../public/close.svg';

export const SelectWalletModal = (): JSX.Element => {
  const { closeModal } = useModalContext();
  const [error, setError] = useState<string>('');
  const { isMobile } = useWindowSize();
  const { activate } = useWeb3React();

  useEffect(() => {
    if (error) setError('');
  }, []);

  const setProvider = (type: string) => {
    window.localStorage.setItem("provider", type);
  };

  const handleBackgroundClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <Background onClick={handleBackgroundClick}>
      <ModalBox >
        <Section>
          <Title>Select Wallet</Title>
          <CloseIconContainer role="button" onClick={closeModal}>
            <CloseIcon />
          </CloseIconContainer>
        </Section>

        <ModalButton
          onClick={() => {
            activate(connectors.coinbaseWallet);
            setProvider("coinbaseWallet");
            closeModal();
          }}
        >
          <Section alignItems="center" justifyContent="center">
            <Image
              width="25px"
              height="25px"
              alt="logo"
              src="/cbw.png"
            />
            <BtnLabel>Coinbase Wallet</BtnLabel>
          </Section>
        </ModalButton>
        <hr />

        <ModalButton
          onClick={() => {
            activate(connectors.walletConnect);
            setProvider("walletConnect");
            closeModal();
          }}
        >
          <Section alignItems="center" justifyContent="center">
            <Image
              width="25px"
              height="25px"
              alt="logo"
              src="/wc.png"
            />
            <BtnLabel>Wallet Connect</BtnLabel>
          </Section>
        </ModalButton>
        <hr />

        <ModalButton
          onClick={() => {
            activate(connectors.injected);
            setProvider("injected");
            closeModal();
          }}
        >
          <Section alignItems="center" justifyContent="center">
            <Image
              width="25px"
              height="25px"
              alt="logo"
              src="/mm.png"
            />
            <BtnLabel>Metamask</BtnLabel>
          </Section>
        </ModalButton>
      </ModalBox>
    </Background>
  );
};
