import { ChangeEvent, KeyboardEvent, useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import SearchInputResultsList from '../SearchInputResultsList';
import {
  InputContainer,
  Input,
  MagnifyingIconButton,
  ClearTextButton,
} from './SearchInput.styled';
import { useWindowSize } from '../../hooks';
import {
  CollectionsByName,
  getAllCollectionNames,
} from '../../services/collections';
import { DEFAULT_COLLECTION } from '../../utils/constants';
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
  const router = useRouter();
  const { isTablet } = useWindowSize();
  const inputRef = useRef<HTMLInputElement>();
  const clearTextButtonRef = useRef<HTMLButtonElement>();
  const resultsListRef = useRef<HTMLUListElement>();
  const [input, setInput] = useState<string>('');
  const [isSearchInputActive, setIsSearchInputActive] = useState<boolean>(
    false
  );
  const [collectionNames, setCollectionNames] = useState<CollectionsByName>({
    [DEFAULT_COLLECTION]: {
      name: DEFAULT_COLLECTION,
      img: null,
    },
  });

  useEffect(() => {
    const removeInputFocusStyle = (e: MouseEvent) => {
      if ((e.target as HTMLInputElement).nodeName !== 'INPUT') {
        setInput('');
        setIsSearchInputActive(false);
      }
    };
    window.addEventListener('click', removeInputFocusStyle);
    return () => window.removeEventListener('click', removeInputFocusStyle);
  }, []);

  useEffect(() => {
    (async () => {
      if (isSearchInputActive) {
        const collections = await getAllCollectionNames();
        setCollectionNames(collections);
      }
    })();
  }, [isSearchInputActive]);

  const updateText = (e: ChangeEvent<HTMLInputElement>) =>
    setInput(e.target.value);

  const clearText = () => {
    setInput('');
    isTablet ? closeMobileSearch() : inputRef.current.focus();
  };

  const search = (type: string) => {
    setInput('');
    setIsSearchInputActive(false);
    if (!type) return;
    router.push(`/search?keywords=${type.toLowerCase()}`);
  };

  const handleClearTextButtonKeyDown = (e: KeyboardEvent) => {
    const isDownArrow = e.key === 'ArrowDown';
    const isTab = e.key === 'Tab' && !e.shiftKey;
    if (resultsListRef.current && (isDownArrow || isTab)) {
      e.preventDefault();
      const firstResultItem = resultsListRef.current
        .childNodes[1] as HTMLElement;
      firstResultItem.focus();
    }
  };

  const handleInputKeyDown = (e: KeyboardEvent) => {
    if (!input) return;

    if (e.key === 'Enter') {
      search(input);
      return;
    }

    const isDownArrow = e.key === 'ArrowDown';
    if (isDownArrow) {
      e.preventDefault();
      const firstResultItem = resultsListRef.current
        .childNodes[1] as HTMLElement;
      firstResultItem.focus();
      return;
    }

    const isTab = e.key === 'Tab' && !e.shiftKey;
    if (isTab) {
      e.preventDefault();
      clearTextButtonRef.current.focus();
    }
  };

  const collections = Object.values(collectionNames)
    .filter(({ name }) => {
      const caseInsensitiveName = name.toLowerCase();
      const caseInsensitiveInput = input.toLowerCase();
      const isFragment = caseInsensitiveName.includes(caseInsensitiveInput);
      return isFragment && caseInsensitiveName !== caseInsensitiveInput;
    })
    .slice(0, 5);

  return (
    <InputContainer
      tabIndex={-1}
      isMobileSearchOpen={isMobileSearchOpen}
      isSearchInputActive={isSearchInputActive}>
      <MagnifyingIconButton onClick={() => search(input)}>
        <MagnifyingIcon />
      </MagnifyingIconButton>
      <Input
        ref={inputRef}
        required
        type="text"
        placeholder="Search by collection"
        value={input}
        onChange={updateText}
        onKeyDown={handleInputKeyDown}
        onFocus={() => setIsSearchInputActive(true)}
      />
      <ClearTextButton
        ref={clearTextButtonRef}
        onClick={clearText}
        isVisibleOnDesktop={input.length !== 0}
        onKeyDown={handleClearTextButtonKeyDown}>
        <CloseIcon />
      </ClearTextButton>
      {input && collections.length !== 0 && (
        <SearchInputResultsList
          input={input}
          collections={collections}
          inputRef={inputRef}
          resultsListRef={resultsListRef}
          clearTextButtonRef={clearTextButtonRef}
          search={search}
          setInput={setInput}
        />
      )}
    </InputContainer>
  );
};

export default SearchInput;
