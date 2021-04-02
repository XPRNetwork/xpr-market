import {
  Dispatch,
  SetStateAction,
  MutableRefObject,
  KeyboardEventHandler,
} from 'react';
import {
  ResultsList,
  ResultListTitle,
  ResultItem,
} from './SearchInputResultsList.styled';
import CollectionIcon from '../CollectionIcon';
import { capitalize } from '../../utils';

type Props = {
  input: string;
  collections: Array<{
    name: string;
    img: string | null;
  }>;
  inputRef: MutableRefObject<HTMLInputElement>;
  resultsListRef: MutableRefObject<HTMLUListElement>;
  search: (type: string) => void;
  setInput: Dispatch<SetStateAction<string>>;
};

const SearchInputResultsList = ({
  input,
  collections,
  inputRef,
  resultsListRef,
  search,
  setInput,
}: Props): JSX.Element => {
  const navigatePrevious: KeyboardEventHandler<HTMLElement> = (e) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    if (target.previousSibling) {
      (target.previousSibling as HTMLElement).focus();
    }
  };

  const navigateNext: KeyboardEventHandler<HTMLElement> = (e) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    if (target.nextSibling) {
      (target.nextSibling as HTMLElement).focus();
    }
  };

  const handleFirstResultItemKeyDown: KeyboardEventHandler<HTMLElement> = (
    e
  ) => {
    const isUpArrow = e.key === 'ArrowUp';
    const isShiftTab = e.key === 'Tab' && e.shiftKey;
    if (isUpArrow || isShiftTab) {
      e.preventDefault();
      inputRef.current.focus();
      return;
    }

    handleResultItemKeyDown(e);
  };

  const handleResultItemKeyDown: KeyboardEventHandler<HTMLElement> = (e) => {
    const name = (e.target as HTMLElement).innerText;
    switch (e.key) {
      case 'Enter':
        setInput(name);
        search(name);
        break;
      case 'ArrowUp':
        navigatePrevious(e);
        break;
      case 'ArrowDown':
        navigateNext(e);
        break;
      case 'Tab':
        if (!e.shiftKey && input !== name) {
          e.preventDefault();
          setInput(name);
        } else {
          setInput('');
        }
        break;
      default:
        break;
    }
  };

  return (
    <ResultsList ref={resultsListRef}>
      <ResultListTitle>Collection</ResultListTitle>
      {collections.map(({ name, img }, i) => (
        <ResultItem
          onKeyDown={
            i === 0 ? handleFirstResultItemKeyDown : handleResultItemKeyDown
          }
          onClick={() => {
            setInput(name);
            search(name);
          }}
          tabIndex={0}
          key={name}>
          <CollectionIcon name={name} image={img} margin="0 16px 0 0" />
          <span>{capitalize(name)}</span>
        </ResultItem>
      ))}
    </ResultsList>
  );
};

export default SearchInputResultsList;
