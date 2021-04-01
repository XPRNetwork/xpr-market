import { ChangeEvent, KeyboardEvent, useState, useRef } from 'react';
import {
  InputContainer,
  Input,
  MagnifyingIconButton,
  CloseIconButton,
} from './SearchInput.styled';
import { useWindowSize } from '../../hooks';
import { ReactComponent as MagnifyingIcon } from '../../public/icon-light-search-24-px.svg';
import { ReactComponent as CloseIcon } from '../../public/icon-light-close-16-px.svg';

type Props = {
  isMobileSearchOpen: boolean;
  closeMobileSearch: () => void;
};

const SearchInput = ({
  isMobileSearchOpen,
  closeMobileSearch,
}: Props): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>();
  const [input, setInput] = useState<string>('');
  const { isTablet } = useWindowSize();

  const updateText = (e: ChangeEvent<HTMLInputElement>) =>
    setInput(e.target.value);

  const handleCloseIconClick = () => {
    setInput('');
    isTablet ? closeMobileSearch() : inputRef.current.focus();
  };

  const search = () => console.log('search');

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      search();
    }
  };

  return (
    <InputContainer tabIndex={-1} isMobileSearchOpen={isMobileSearchOpen}>
      <MagnifyingIconButton onClick={search}>
        <MagnifyingIcon />
      </MagnifyingIconButton>
      <Input
        ref={inputRef}
        required
        type="text"
        placeholder="Search by collection"
        value={input}
        onChange={updateText}
        onKeyDown={handleKeyDown}
      />
      <CloseIconButton onClick={handleCloseIconClick} hasText={!!input}>
        <CloseIcon />
      </CloseIconButton>
    </InputContainer>
  );
};

export default SearchInput;
