import { useState } from 'react';
import {
  MenuContainer,
  PopupMenuButton,
  Menu,
  MenuItem,
  TransparentBackground,
} from './AssetFormPopupMenu.styled';
import { ReactComponent as Ellipsis } from '../../public/ellipsis.svg';
import { useModalContext, MODAL_TYPES, MintAssetModalProps } from '../Provider';
import { useScrollLock, useEscapeKeyClose } from '../../hooks';

type Props = {
  setCurrentAssetAsModalProps?: () => void;
  assetIds?: string[];
  saleIds?: string[];
  isTemplateCreator?: boolean;
};

const AssetFormPopupMenu = ({
  setCurrentAssetAsModalProps,
  assetIds,
  saleIds,
  isTemplateCreator,
}: Props): JSX.Element => {
  const { openModal, modalProps } = useModalContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const togglePopupMenu = () => setIsOpen(!isOpen);
  const closePopupMenu = () => setIsOpen(false);
  useScrollLock(isOpen);
  useEscapeKeyClose(closePopupMenu);

  const isMintAssetModalHidden = (): boolean => {
    if (!modalProps) return true;
    const { maxEditionSize, editionSize } = modalProps as MintAssetModalProps;
    const hasMintedMaxSupply =
      maxEditionSize && editionSize && maxEditionSize === editionSize;
    return !isTemplateCreator || hasMintedMaxSupply;
  };

  const popupMenuItems = [
    {
      isHidden: !assetIds || assetIds.length === 0,
      name: 'Mark all for sale',
      onClick: () => {
        setIsOpen(false);
        openModal(MODAL_TYPES.CREATE_MULTIPLE_SALES);
      },
    },
    {
      isHidden: isMintAssetModalHidden(),
      name: 'Mint more assets',
      onClick: () => {
        setIsOpen(false);
        openModal(MODAL_TYPES.MINT_ASSET);
      },
    },
    {
      isHidden: false,
      name: 'Transfer NFT',
      onClick: () => {
        setIsOpen(false);
        openModal(MODAL_TYPES.TRANSFER);
        setCurrentAssetAsModalProps();
      },
    },
    {
      isHidden: false,
      name: 'Burn NFT',
      onClick: () => {
        setIsOpen(false);
        openModal(MODAL_TYPES.BURN_ASSET);
        setCurrentAssetAsModalProps();
      },
    },
    {
      isHidden: !saleIds || saleIds.length === 0,
      name: 'Cancel all sales',
      onClick: () => {
        setIsOpen(false);
        openModal(MODAL_TYPES.CANCEL_MULTIPLE_SALES);
      },
    },
  ];

  return (
    <MenuContainer>
      <PopupMenuButton onClick={togglePopupMenu}>
        <Ellipsis />
      </PopupMenuButton>
      <Menu isOpen={isOpen}>
        {popupMenuItems.map(({ isHidden, name, onClick }) => {
          if (!isHidden) {
            return (
              <MenuItem key={name} tabIndex={0} onClick={onClick}>
                {name}
              </MenuItem>
            );
          }
        })}
      </Menu>
      <TransparentBackground isOpen={isOpen} onClick={closePopupMenu} />
    </MenuContainer>
  );
};

export default AssetFormPopupMenu;
