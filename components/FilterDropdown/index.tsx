import { FC, useState } from 'react';
import {
  MenuContainer,
  MenuButton,
  MenuButtonText,
  Menu,
  MenuItem,
  TransparentBackground,
} from './FilterDropdown.styled';
import { ReactComponent as DownArrow } from '../../public/down-arrow-sm.svg';
import { ReactComponent as Checkmark } from '../../public/icon-light-check-24-px.svg';
import { useScrollLock, useEscapeKeyClose } from '../../hooks';

export type FilterDropdownProps = {
  filters: string[];
  activeFilter: string;
  handleFilterClick: (filter: string) => void;
};

const FilterDropdown: FC<FilterDropdownProps> = ({
  filters = [],
  activeFilter = '',
  handleFilterClick = () => {},
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const togglePopupMenu = () => setIsOpen(!isOpen);
  const closePopupMenu = () => setIsOpen(false);
  useScrollLock(isOpen);
  useEscapeKeyClose(closePopupMenu);

  return (
    <MenuContainer>
      <MenuButton onClick={togglePopupMenu}>
        <MenuButtonText>Sort by</MenuButtonText>
        <DownArrow />
      </MenuButton>
      <Menu isOpen={isOpen}>
        {filters.map((name) => (
          <MenuItem
            key={name}
            tabIndex={0}
            onClick={() => {
              handleFilterClick(name);
              closePopupMenu();
            }}>
            <span>{name}</span>
            <span>{activeFilter === name && <Checkmark />}</span>
          </MenuItem>
        ))}
      </Menu>
      <TransparentBackground isOpen={isOpen} onClick={closePopupMenu} />
    </MenuContainer>
  );
};

export default FilterDropdown;
