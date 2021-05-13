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
  ResultItemName,
  SeeAllLink,
  LoadingSearchBox,
} from './SearchInputResultsList.styled';
import {
  SearchCollection,
  SearchAuthor,
  SearchTemplate,
} from '../../services/search';
import TemplateIcon from '../TemplateIcon';
import CollectionIcon from '../CollectionIcon';
import AvatarIcon from '../AvatarIcon';
import { useRouter } from 'next/router';
import Spinner from '../Spinner';

type Props = {
  input: string;
  collections?: SearchCollection[];
  templates?: SearchTemplate[];
  authors?: SearchAuthor[];
  inputRef: MutableRefObject<HTMLInputElement>;
  resultsListRef: MutableRefObject<HTMLUListElement>;
  clearTextButtonRef: MutableRefObject<HTMLButtonElement>;
  setInput: Dispatch<SetStateAction<string>>;
  search: (string) => void;
  isSearching: boolean;
};

const SearchInputResultsList = ({
  input,
  collections,
  authors,
  templates,
  inputRef,
  resultsListRef,
  clearTextButtonRef,
  search,
  setInput,
  isSearching,
}: Props): JSX.Element => {
  const router = useRouter();
  const navigatePrevious: KeyboardEventHandler<HTMLElement> = (e) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    const previousSibling = target.previousElementSibling as HTMLElement;

    if (previousSibling && previousSibling.tagName === 'H3') {
      (previousSibling.previousElementSibling as HTMLElement).focus();
    } else if (previousSibling) {
      previousSibling.focus();
    }
  };

  const navigateNext: KeyboardEventHandler<HTMLElement> = (e) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    const nextSibling = target.nextElementSibling as HTMLElement;

    if (nextSibling && nextSibling.tagName === 'H3') {
      (nextSibling.nextElementSibling as HTMLElement).focus();
    } else if (nextSibling) {
      nextSibling.focus();
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
        if (element.className.includes('collection')) {
          setInput('');
          router.push(`${element.getAttribute('data-key')}`);
        } else if (element.className.includes('template')) {
          setInput('');
          router.push(`${element.getAttribute('data-key')}`);
        } else {
          setInput('');
          router.push(`${element.getAttribute('data-key')}`);
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

  if (isSearching) {
    return (
      <LoadingSearchBox>
        <Spinner size="45px" />
      </LoadingSearchBox>
    );
  }

  if (!input || (!collections.length && !authors.length && !templates.length)) {
    return <></>;
  }

  return (
    <ResultsList ref={resultsListRef}>
      {templates.length ? <ResultListTitle>NFTs</ResultListTitle> : null}
      {templates.map(({ name, id, collection, img, video }, i) => (
        <ResultItem
          className="template"
          onKeyDown={
            i === 0 ? handleFirstResultItemKeyDown : handleResultItemKeyDown
          }
          onClick={() => {
            setInput('');
            router.push(`/${collection}/${id}`);
          }}
          onTouchStart={() => {
            setInput('');
            router.push(`/${collection}/${id}`);
          }}
          tabIndex={0}
          data-key={`/${collection}/${id}`}
          key={name}>
          <TemplateIcon
            name={name}
            image={img}
            video={video}
            margin="0 12px 0 0"
          />
          <ResultItemName>{name}</ResultItemName>
        </ResultItem>
      ))}
      {collections.length ? (
        <ResultListTitle>Collection</ResultListTitle>
      ) : null}
      {collections.map(({ name, img, collection_name, author }, i) => (
        <ResultItem
          className="collection"
          onKeyDown={
            i + templates.length === 0
              ? handleFirstResultItemKeyDown
              : handleResultItemKeyDown
          }
          onClick={() => {
            setInput('');
            router.push(`/${collection_name}`);
          }}
          onTouchStart={() => {
            setInput('');
            router.push(`/${collection_name}`);
          }}
          tabIndex={0}
          data-key={`/${collection_name}`}
          key={`${author} - ${collection_name}`}>
          <CollectionIcon
            name={name}
            image={img}
            margin="0 12px 0 0"
            width="24px"
          />
          <ResultItemName>{name || collection_name}</ResultItemName>
        </ResultItem>
      ))}
      {authors.length ? <ResultListTitle>Members</ResultListTitle> : null}
      {authors.map(({ name, avatar, acc }, i) => (
        <ResultItem
          className="user"
          onKeyDown={
            i + templates.length + collections.length === 0
              ? handleFirstResultItemKeyDown
              : handleResultItemKeyDown
          }
          onClick={() => {
            setInput('');
            router.push(`/user/${acc}`);
          }}
          onTouchStart={() => {
            setInput('');
            router.push(`/user/${acc}`);
          }}
          tabIndex={0}
          data-key={`/user/${acc}`}
          key={acc}>
          <AvatarIcon avatar={avatar} size="24px" margin="0 12px 0 0" />
          <ResultItemName>{name || acc}</ResultItemName>
        </ResultItem>
      ))}
      <SeeAllLink
        onClick={() => search(input)}
        onKeyDown={(e) => {
          e.preventDefault();
          if (e.key === 'ArrowUp') navigatePrevious(e);
          if (e.key === 'Enter') search(input);
        }}>
        See all search results
      </SeeAllLink>
    </ResultsList>
  );
};

export default SearchInputResultsList;
