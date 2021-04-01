import { useState } from 'react';
import {
  MenuContainer,
  PopupMenuButton,
  Menu,
  MenuItem,
  TransparentBackground,
} from './AssetFormPopupMenu.styled';
import { ReactComponent as Ellipsis } from '../../public/ellipsis.svg';
import { useModalContext, MODAL_TYPES } from '../Provider';
import { useScrollLock, useEscapeKeyClose } from '../../hooks';

type Props = {
  transferNFT?: () => void;
  assetIds?: string[];
  saleIds?: string[];
};

const AssetFormPopupMenu = ({
  transferNFT,
  assetIds,
  saleIds,
}: Props): JSX.Element => {
  const { openModal } = useModalContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const togglePopupMenu = () => setIsOpen(!isOpen);
  const closePopupMenu = () => setIsOpen(false);
  useScrollLock(isOpen);
  useEscapeKeyClose(closePopupMenu);

  const popupMenuItems = [
    {
      isHidden: false,
      name: 'Transfer NFT',
      onClick: () => {
        setIsOpen(false);
        transferNFT();
      },
    },
    {
      isHidden: !assetIds || assetIds.length === 0,
      name: 'Mark all for sale',
      onClick: () => {
        setIsOpen(false);
        openModal(MODAL_TYPES.CREATE_MULTIPLE_SALES);
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
