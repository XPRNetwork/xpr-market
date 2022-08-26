import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useToasts } from 'react-toast-notifications';
import { useAuthContext, useModalContext, ConfirmTeleportModalProps } from '../Provider';
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
import { teleportToProton, claimNfts } from '../../services/ethereum';

export const ConfirmTeleportModal = (): JSX.Element => {
  const { closeModal, modalProps } = useModalContext();
  const { currentUser } = useAuthContext();
  const { library, account } = useWeb3React();
  const { addToast } = useToasts();

  const [error, setError] = useState<string>('');

  const {
    ethToProton,
    tokenContract,
    tokenId,
    assetId,
    fetchPageData,
  } = modalProps as ConfirmTeleportModalProps;

  useEffect(() => {
    if (error) setError('');
  }, []);

  const teleportNFT = async () => {
    if (ethToProton) {
      await teleportToProton({
        tokenContract: tokenContract,
        tokenIds: [tokenId],
        provider: library.getSigner(),
        to: currentUser.actor
      });

      /*
        Todo:
        1. Check if transaction confirmed
      */
    } else {
      const teleportRes = await protonSDK.teleportToEth({
        asset_id: assetId,
        to_address: account?.substring(2)
      });
      
      if (!teleportRes.success) {
        addToast('Teleport failed.', { appearance: 'error', autoDismiss: true });
        return;
      }
      
      /*
        Todo:
        1. Check outreqs table
        2. Claim transaction
      */
    }
    
    fetchPageData();
    addToast(`Teleported successfully.`, { appearance: 'success', autoDismiss: true });
    closeModal();
  }

  const claimNFT = async () => {
    if (ethToProton) {
      await claimNfts(tokenContract, [tokenId], library.getSigner());

      // Todo 
      // Check if transaction confirmed
    } else {
      const claimbackRes = await protonSDK.claimbackTeleport({
        asset_id: assetId
      });

      if (!claimbackRes.success) {
        addToast('Claim back failed.', { appearance: 'error', autoDismiss: true });
        return;
      }
    }

    fetchPageData();
    addToast('Claimed successfully!', { appearance: 'success', autoDismiss: true });
    closeModal();
  }

  return (
    <Background>
      <ModalBox>
        <Section>
          <Title>Teleport NFT</Title>
          <CloseIconContainer role="button" onClick={closeModal}>
            <CloseIcon />
          </CloseIconContainer>
        </Section>
        <Description>
          Are you sure you will teleport this NFT?
        </Description>
        <Section>
          <HalfButton onClick={claimNFT}>
            Claim
          </HalfButton>
          <HalfButton onClick={teleportNFT}>
            Teleport
          </HalfButton>
        </Section>
      </ModalBox>
    </Background>
  );
};
