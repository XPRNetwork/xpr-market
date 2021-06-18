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
import { SearchCollection, SearchAuthor } from '../../services/search';
import { Template } from '../../services/templates';
import TemplateIcon from '../TemplateIcon';
import CollectionIcon from '../CollectionIcon';
import AvatarIcon from '../AvatarIcon';
import { useRouter } from 'next/router';
import Spinner from '../Spinner';

type Props = {
  input: string;
  collections?: SearchCollection[];
  templates?: Template[];
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
        setInput('');
        router.push(element.getAttribute('data-key'));
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

  const handleClick = (link) => {
    setInput('');
    router.push(link);
  };

  if (isSearching) {
    return (
      <LoadingSearchBox ref={resultsListRef}>
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
      {templates.map(
        (
          {
            name,
            template_id,
            collection: { collection_name },
            immutable_data: { image, video },
          },
          i
        ) => {
          const link = `/${collection_name}/${template_id}`;
          return (
            <ResultItem
              className="template"
              onKeyDown={
                i === 0 ? handleFirstResultItemKeyDown : handleResultItemKeyDown
              }
              onClick={() => handleClick(link)}
              tabIndex={0}
              data-key={link}
              key={name}>
              <TemplateIcon
                name={name}
                image={image}
                video={video}
                margin="0 12px 0 0"
              />
              <ResultItemName>{name}</ResultItemName>
            </ResultItem>
          );
        }
      )}
      {collections.length ? (
        <ResultListTitle>Collection</ResultListTitle>
      ) : null}
      {collections.map(({ name, img, collection_name, author }, i) => {
        const link = `/${collection_name}`;
        return (
          <ResultItem
            className="collection"
            onKeyDown={
              i + templates.length === 0
                ? handleFirstResultItemKeyDown
                : handleResultItemKeyDown
            }
            onClick={() => handleClick(link)}
            tabIndex={0}
            data-key={link}
            key={`${author} - ${collection_name}`}>
            <CollectionIcon
              name={name}
              image={img}
              margin="0 12px 0 0"
              width="24px"
            />
            <ResultItemName>{name || collection_name}</ResultItemName>
          </ResultItem>
        );
      })}
      {authors.length ? <ResultListTitle>Members</ResultListTitle> : null}
      {authors.map(({ name, avatar, acc }, i) => {
        const link = `/user/${acc}`;
        return (
          <ResultItem
            className="user"
            onKeyDown={
              i + templates.length + collections.length === 0
                ? handleFirstResultItemKeyDown
                : handleResultItemKeyDown
            }
            onClick={() => handleClick(link)}
            tabIndex={0}
            data-key={link}
            key={acc}>
            <AvatarIcon avatar={avatar} size="24px" margin="0 12px 0 0" />
            <ResultItemName>{name || acc}</ResultItemName>
          </ResultItem>
        );
      })}
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
