import { useState } from 'react';
import {
  MenuContainer,
  MenuButton,
  Menu,
  MenuItem,
  TransparentBackground,
} from './FilterDropdown.styled';
import { ReactComponent as DownArrow } from '../../public/down-arrow.svg';
import { useScrollLock, useEscapeKeyClose } from '../../hooks';
import { capitalize } from '../../utils';
import { FILTER_TYPES } from '../../utils/constants';

type Props = {
  filters: string[];
  activeFilter: string;
  handleFilterClick: (filter: string) => void;
};

const formatFilterName = (name: string) =>
  capitalize(name.toLowerCase().split('_').join(' '));

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
        Sort by <DownArrow />
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
            <span>{formatFilterName(name)}</span>
            <span>{activeFilter === name && 'checkmark'}</span>
          </MenuItem>
        ))}
      </Menu>
      <TransparentBackground isOpen={isOpen} onClick={closePopupMenu} />
    </MenuContainer>
  );
};

FilterDropdown.defaultProps = {
  filters: [FILTER_TYPES.NAME, FILTER_TYPES.RECENTLY_CREATED],
  activeFilter: FILTER_TYPES.NAME,
  handleFilterClick: () => {},
};

export default FilterDropdown;
