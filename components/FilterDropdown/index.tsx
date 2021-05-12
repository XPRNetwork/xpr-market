import { useState } from 'react';
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
import { FILTER_TYPES } from '../../utils/constants';

type Filter = {
  type: string;
  label: string;
};

type Props = {
  filters: Filter[];
  activeFilter: string;
  handleFilterClick: (filter: string) => void;
};

const FilterDropdown = ({
  filters,
  activeFilter,
  handleFilterClick,
}: Props): JSX.Element => {
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
        {filters.map(({ type, label }) => (
          <MenuItem
            key={type}
            tabIndex={0}
            onClick={() => {
              handleFilterClick(type);
              closePopupMenu();
            }}>
            <span>{label}</span>
            <span>{activeFilter === type && <Checkmark />}</span>
          </MenuItem>
        ))}
      </Menu>
      <TransparentBackground isOpen={isOpen} onClick={closePopupMenu} />
    </MenuContainer>
  );
};

FilterDropdown.defaultProps = {
  filters: [
    { type: FILTER_TYPES.NAME, label: 'Name' },
    { type: FILTER_TYPES.RECENTLY_CREATED, label: 'Recently created' },
  ],
  activeFilter: FILTER_TYPES.NAME,
  handleFilterClick: () => {},
};

export default FilterDropdown;
