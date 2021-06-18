import { ChangeEvent, KeyboardEvent, useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import SearchInputResultsList from '../SearchInputResultsList';
import {
  InputContainer,
  Input,
  MagnifyingIconButton,
  ClearTextButton,
} from './SearchInput.styled';
import { SearchCollection, SearchAuthor } from '../../services/search';
import { Template } from '../../services/templates';
import { getFromApi } from '../../utils/browser-fetch';
import { ReactComponent as MagnifyingIcon } from '../../public/icon-light-search-24-px.svg';
import { ReactComponent as CloseIcon } from '../../public/icon-light-close-16-px.svg';
import { useClickAway } from '../../hooks';

type Props = {
  isMobileSearchOpen: boolean;
  closeMobileSearch: () => void;
};

type SearchResponse = {
  index: string;
  keys: string[];
  result: (SearchCollection | SearchAuthor | Template)[];
};

let debounceTimer;

const SearchInput = ({
  isMobileSearchOpen,
  closeMobileSearch,
}: Props): JSX.Element => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>();
  const clearTextButtonRef = useRef<HTMLButtonElement>();
  const resultsListRef = useRef<HTMLUListElement>();
  const [input, setInput] = useState<string>('');
  const [isSearchInputActive, setIsSearchInputActive] = useState<boolean>(
    false
  );
  const [searchCollections, setSearchCollections] = useState<
    SearchCollection[]
  >([]);
  const [searchTemplates, setSearchTemplates] = useState<Template[]>([]);
  const [searchAuthors, setSearchAuthors] = useState<SearchAuthor[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  useClickAway(resultsListRef, () => {
    setInput('');
    setIsSearchInputActive(false);
    setIsSearching(false);
    closeMobileSearch();
  });

  useEffect(() => {
    (async () => {
      if (isSearchInputActive && input) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          getSearchResults();
        }, 300);
      } else if (!input) {
        clearSearchResults();
      }
    })();

    return () => clearTimeout(debounceTimer);
  }, [input, isSearchInputActive]);

  const clearSearchResults = () => {
    setSearchCollections([]);
    setSearchAuthors([]);
    setSearchTemplates([]);
  };

  const getSearchResults = async (): Promise<void> => {
    try {
      setIsSearching(true);
      const res = await getFromApi<SearchResponse[]>(
        `/api/search?query=${input}`
      );

      if (res.success) {
        const result = res.message;
        const collections =
          result
            .find((obj) => obj.index === 'market_collections')
            .result.slice(0, 3) || [];
        const users =
          result
            .find((obj) => obj.index === 'market_authors')
            .result.slice(0, 3) || [];
        const templates =
          result
            .find((obj) => obj.index === 'market_templates')
            .result.slice(0, 3) || [];
        setSearchCollections(collections as SearchCollection[]);
        setSearchAuthors(users as SearchAuthor[]);
        setSearchTemplates(templates as Template[]);
        setIsSearching(false);
      }
    } catch (e) {
      setIsSearching(false);
      clearSearchResults();
    }
  };

  const updateText = (e: ChangeEvent<HTMLInputElement>) =>
    setInput(e.target.value);

  const clearText = () => {
    if (input) {
      setInput('');
    } else {
      closeMobileSearch();
    }
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
    const hasResults =
      searchCollections.length ||
      searchTemplates.length ||
      searchAuthors.length;

    if (isDownArrow && hasResults) {
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
        placeholder="Search by collection, members, NFTs"
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
      <SearchInputResultsList
        isSearching={isSearching}
        input={input}
        search={search}
        collections={searchCollections}
        authors={searchAuthors}
        templates={searchTemplates}
        inputRef={inputRef}
        resultsListRef={resultsListRef}
        clearTextButtonRef={clearTextButtonRef}
        setInput={setInput}
      />
    </InputContainer>
  );
};

export default SearchInput;
