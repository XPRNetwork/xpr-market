import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { connectors } from '../../services/ethereum';
import { useModalContext } from '../Provider';
import {
  Background,
  ModalBox,
  Section,
  CloseIconContainer,
  Title,
  BtnLabel,
  ModalButton,
} from './Modal.styled';
import { Image } from '../../styles/index.styled';
import { ReactComponent as CloseIcon } from '../../public/close.svg';

export const SelectWalletModal = (): JSX.Element => {
  const { closeModal } = useModalContext();
  const [error, setError] = useState<string>('');
  const { activate } = useWeb3React();

  useEffect(() => {
    if (error) setError('');
  }, []);

  const setProvider = (type: string) => {
    window.localStorage.setItem('provider', type);
  };

  const changeNetwork = async () => {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    if (!(window as any).ethereum) return;

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    await (window as any).ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: `0x${Number(137).toString(16)}`,
          chainName: 'Polygon Mainnet',
          nativeCurrency: {
            name: 'MATIC',
            symbol: 'MATIC',
            decimals: 18,
          },
          rpcUrls: ['https://polygon-rpc.com/'],
          blockExplorerUrls: ['https://polygonscan.com/'],
        },
      ],
    });
  };

  const connectWallet = (type: string) => {
    changeNetwork();
    if (type === 'metamask') {
      activate(connectors.injected);
      setProvider('injected');
    } else if (type === 'coinbase') {
      activate(connectors.coinbaseWallet);
      setProvider('coinbaseWallet');
    } else {
      activate(connectors.walletConnect);
      setProvider('walletConnect');
    }
    closeModal();
  };

  return (
    <Background>
      <ModalBox>
        <Section>
          <Title>Select Wallet</Title>
          <CloseIconContainer role="button" onClick={closeModal}>
            <CloseIcon />
          </CloseIconContainer>
        </Section>

        <ModalButton onClick={() => connectWallet('metamask')}>
          <Section alignItems="center" justifyContent="center">
            <Image width="25px" height="25px" alt="logo" src="/mm.png" />
            <BtnLabel>Metamask</BtnLabel>
          </Section>
        </ModalButton>
        <hr />

        <ModalButton onClick={() => connectWallet('coinbase')}>
          <Section alignItems="center" justifyContent="center">
            <Image width="25px" height="25px" alt="logo" src="/cbw.png" />
            <BtnLabel>Coinbase Wallet</BtnLabel>
          </Section>
        </ModalButton>
        <hr />

        {/* <ModalButton onClick={() => connectWallet('walletConnect')}>
          <Section alignItems="center" justifyContent="center">
            <Image width="25px" height="25px" alt="logo" src="/wc.png" />
            <BtnLabel>Wallet Connect</BtnLabel>
          </Section>
        </ModalButton> */}
      </ModalBox>
    </Background>
  );
};
