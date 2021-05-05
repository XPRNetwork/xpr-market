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
import { SearchCollection } from '../../services/collections';
import { SearchUser } from '../../services/users';
import CollectionIcon from '../CollectionIcon';
import AvatarIcon from '../AvatarIcon';
import { useRouter } from 'next/router';

type Props = {
  input: string;
  collections?: SearchCollection[];
  users?: SearchUser[];
  inputRef: MutableRefObject<HTMLInputElement>;
  resultsListRef: MutableRefObject<HTMLUListElement>;
  clearTextButtonRef: MutableRefObject<HTMLButtonElement>;
  search: (type: string) => void;
  setInput: Dispatch<SetStateAction<string>>;
};

const SearchInputResultsList = ({
  input,
  collections,
  users,
  inputRef,
  resultsListRef,
  clearTextButtonRef,
  search,
  setInput,
}: Props): JSX.Element => {
  const router = useRouter();
  const navigatePrevious: KeyboardEventHandler<HTMLElement> = (e) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    if (
      target.previousSibling &&
      target.previousElementSibling.tagName === 'H3'
    ) {
      (target.previousSibling.previousSibling as HTMLElement).focus();
    } else if (target.previousSibling) {
      (target.previousSibling as HTMLElement).focus();
    }
  };

  const navigateNext: KeyboardEventHandler<HTMLElement> = (e) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    if (target.nextSibling && target.nextElementSibling.tagName === 'H3') {
      (target.nextSibling.nextSibling as HTMLElement).focus();
    } else if (target.nextSibling) {
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
    const element = e.target as HTMLElement;
    const name = element.innerText;
    switch (e.key) {
      case 'Enter':
        if ((e.target as HTMLElement).className.includes('collection')) {
          setInput('');
          search((e.target as HTMLElement).getAttribute('data-key'));
        } else {
          setInput('');
          router.push(`/user/${element.getAttribute('data-key')}`);
        }
        break;
      case 'ArrowUp':
        navigatePrevious(e);
        break;
      case 'ArrowDown':
        navigateNext(e);
        break;
      case 'Tab':
        e.preventDefault();
        if (!e.shiftKey && input !== name) {
          setInput(name);
        } else {
          clearTextButtonRef.current.focus();
        }
        break;
      default:
        break;
    }
  };

  return (
    <ResultsList ref={resultsListRef}>
      {collections.length ? (
        <ResultListTitle>Collection</ResultListTitle>
      ) : null}
      {collections.map(({ name, img, collection_name, author }, i) => (
        <ResultItem
          className="collection"
          onKeyDown={
            i === 0 ? handleFirstResultItemKeyDown : handleResultItemKeyDown
          }
          onClick={() => {
            setInput(name);
            search(collection_name);
          }}
          onTouchStart={() => {
            setInput(name);
            search(collection_name);
          }}
          tabIndex={0}
          data-key={collection_name}
          key={`${author} - ${collection_name}`}>
          <CollectionIcon name={name} image={img} margin="0 16px 0 0" />
          <span>{name}</span>
        </ResultItem>
      ))}
      {users.length ? <ResultListTitle>Members</ResultListTitle> : null}
      {users.map(({ name, avatar, acc }) => (
        <ResultItem
          className="user"
          onKeyDown={handleResultItemKeyDown}
          onClick={() => {
            setInput('');
            router.push(`/user/${acc}`);
          }}
          onTouchStart={() => {
            setInput('');
            router.push(`/user/${acc}`);
          }}
          tabIndex={0}
          data-key={acc}
          key={acc}>
          <AvatarIcon avatar={avatar} size="24px" />
          <span>{name || acc}</span>
        </ResultItem>
      ))}
    </ResultsList>
  );
};

export default SearchInputResultsList;
