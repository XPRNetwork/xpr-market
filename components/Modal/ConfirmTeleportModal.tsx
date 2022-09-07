import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useToasts } from 'react-toast-notifications';
import { useAuthContext, useModalContext, ConfirmTeleportModalProps } from '../Provider';
import protonSDK from '../../services/proton';
import proton from '../../services/proton-rpc';
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
import { delay } from '../../utils';
import LoadingPage from '../LoadingPage';

export const ConfirmTeleportModal = (): JSX.Element => {
  const { closeModal, modalProps } = useModalContext();
  const { currentUser } = useAuthContext();
  const { library, account } = useWeb3React();
  const { addToast } = useToasts();

  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  // const checkOutReqs = async () => {
  //   const outreqs = await proton.getOutReqsForTeleport();
  //   const index = outreqs.findIndex(el => el.asset_id == assetId);
  //   if (index > -1) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  const teleportNFT = async () => {
    setIsLoading(true);
    if (ethToProton) {
      const txPreHash = await teleportToProton({
        tokenContract: tokenContract,
        tokenIds: [tokenId],
        provider: library.getSigner(),
        to: currentUser.actor
      });

      try {
        await txPreHash.wait();
        addToast(`Teleported successfully.`, { appearance: 'success', autoDismiss: true });
      } catch (err) {
        addToast('Teleport failed.', { appearance: 'error', autoDismiss: true });
      }
    } else {
      const teleportRes = await protonSDK.teleportToEth({
        asset_id: assetId,
        to_address: account?.substring(2)
      });
      
      if (!teleportRes.success) {
        addToast('Teleport failed.', { appearance: 'error', autoDismiss: true });
        addToast('Please check deposit list and claim back.', { appearance: 'info', autoDismiss: false });
      } else {
        addToast(`Teleported successfully.`, { appearance: 'success', autoDismiss: true });
      }
      
      /*
        1. Check outreqs table
        2. Claim transaction
      */
      // const startTime = new Date().getTime();
      // do {
      //   await delay(1000);
      //   const elapsedTime = new Date().getTime() - startTime;
      //   console.log("--- elapsed", elapsedTime);
      // } while (await checkOutReqs());

      // const txPreHash = await claimNfts(tokenContract, [tokenId], library.getSigner());
      // console.log("-------- txPreHash", txPreHash)
      // try {
      //   await txPreHash.wait();
      // } catch (err) {
      //   addToast('Claim failed.', { appearance: 'error', autoDismiss: true });
      //   console.log("claim error", err);
      // }
    }
    
    await delay(1000);
    await fetchPageData();
    setIsLoading(false);
    closeModal();
  }

  const claimNFT = async () => {
    setIsLoading(true);
    if (ethToProton) {
      const txPreHash = await claimNfts(tokenContract, [tokenId], library.getSigner());
      try {
        await txPreHash.wait();
      } catch (err) {
        setIsLoading(false);
        addToast('Claim failed.', { appearance: 'error', autoDismiss: true });
        console.log("claim error", err);
      }
    } else {
      const claimbackRes = await protonSDK.claimbackTeleport({
        asset_id: assetId
      });

      if (!claimbackRes.success) {
        setIsLoading(false);
        addToast('Claim back failed.', { appearance: 'error', autoDismiss: true });
        return;
      }
    }

    await fetchPageData();
    setIsLoading(false);
    addToast('Claimed successfully!', { appearance: 'success', autoDismiss: true });
    closeModal();
  }

  return (
    <Background>
      {!isLoading ? <ModalBox>
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
      </ModalBox> :
      <LoadingPage></LoadingPage>}
    </Background>
  );
};
