import { useEffect, useState } from 'react';
import TabSection, { SectionContainerProps } from '.';
import LoadingPage from '../LoadingPage';
import { Section } from '../../styles/index.styled';
import {
  SearchResultsByType,
  SearchTemplate,
  SearchAuthor,
  SearchCollection,
} from '../../services/search';
import {
  PAGINATION_LIMIT,
  TAB_TYPES,
  CARD_RENDER_TYPES,
  FILTER_TYPES,
  FILTER_ORDER,
} from '../../utils/constants';
import { getFromApi } from '../../utils/browser-fetch';

interface Props extends SectionContainerProps {
  query: string;
  searchContentType: string;
}

const searchContent = {
  templates: {
    cardRenderType: CARD_RENDER_TYPES.SEARCH_TEMPLATE,
    activeTab: TAB_TYPES.NFTS,
  },
  authors: {
    cardRenderType: CARD_RENDER_TYPES.CREATOR,
    activeTab: TAB_TYPES.CREATORS,
  },
  collections: {
    cardRenderType: CARD_RENDER_TYPES.COLLECTION,
    activeTab: TAB_TYPES.COLLECTIONS,
  },
};

const TabSectionSearch = ({
  query,
  searchContentType,
  ...tabsProps
}: Props): JSX.Element => {
  const [renderedItems, setRenderedItems] = useState<
    (SearchTemplate | SearchAuthor | SearchCollection)[]
  >([]);
  const [prefetchedItems, setPrefetchedItems] = useState<
    (SearchTemplate | SearchAuthor | SearchCollection)[]
  >([]);
  const [isLoadingPrices, setIsLoadingPrices] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [isLoadingInitialMount, setIsLoadingInitialMount] = useState<boolean>(
    true
  );
  const [prefetchPageNumber, setPrefetchPageNumber] = useState<number>(3);
  const [filterType, setFilterType] = useState<string>('');
  const [filterOrder, setFilterOrder] = useState<string>(FILTER_ORDER.DESC);

  useEffect(() => {
    (async () => {
      if (query) {
        setIsFetching(true);
        setIsLoadingPrices(true);
        setIsLoadingInitialMount(true);

        try {
          await getFromApi({
            page: '1',
          });
          setIsLoadingInitialMount(false);
          setIsLoadingPrices(false);
          await fetchNextPage();
        } catch (e) {
          setIsFetching(false);
          setIsLoadingInitialMount(false);
        }
      }
    })();
  }, [query]);

  const getFromApi = async ({
    page,
    sortOrder,
  }: {
    page: string;
    sortOrder?: string;
  }) => {
    const sortQueryParams = sortOrder
      ? `&sortOrder=${sortOrder}&sortKey=name`
      : '';
    const res = await getFromApi<
      SearchResultsByType<SearchTemplate | SearchAuthor | SearchCollection>
    >(
      `/api/search-by/${searchContentType}?query=${query}&page=${page}${sortQueryParams}`
    );
    if (!res.success) throw new Error(res.error.message);
    setRenderedItems(res.message.contents);
  };

  const showNextNFTSearchPage = async () => {
    setRenderedItems((prevItems) => [...prevItems, ...prefetchedItems]);
    await fetchNextPage();
  };

  const handleItemsFilterClick = (filter: string) => {
    if (filter === filterType) {
      setFilterOrder((prevFilterOrder) =>
        prevFilterOrder === FILTER_ORDER.ASC
          ? FILTER_ORDER.DESC
          : FILTER_ORDER.ASC
      );
    } else {
      setFilterType(filterType);
      setFilterOrder(FILTER_ORDER.DESC);
    }
  };

  const fetchNextPage = async () => {
    if (prefetchPageNumber > 0) {
      setIsFetching(true);
      const result = await getFromApi<
        SearchResultsByType<SearchTemplate | SearchAuthor | SearchCollection>
      >(
        `/api/search-by/${searchContentType}?query=${query}&page=${prefetchPageNumber}`
      );
      setPrefetchedItems(result.message.contents);
      setPrefetchPageNumber((prevPageNumber) =>
        prefetchPageNumber >= result.message.totalPages
          ? -1
          : prevPageNumber + 1
      );
      setIsFetching(false);
    }
  };

  return (
    <Section
      isHidden={
        tabsProps.activeTab !== searchContent[searchContentType].activeTab
      }>
      {isLoadingInitialMount ? (
        <LoadingPage margin="10% 0" />
      ) : (
        <TabSection
          showNextPage={showNextNFTSearchPage}
          type={searchContent[searchContentType].cardRenderType}
          isLoadingPrices={isLoadingPrices}
          isFetching={isFetching}
          rendered={renderedItems}
          nextPageNumber={prefetchPageNumber}
          tabsProps={tabsProps}
          filterDropdownProps={{
            filters: [FILTER_TYPES.NAME, FILTER_TYPES.RECENTLY_CREATED],
            activeFilter: filterType,
            handleFilterClick: handleItemsFilterClick,
          }}
          emptyContent={{
            subtitle: 'No search results!',
            buttonTitle: 'Explore NFTs',
            link: '/',
          }}
        />
      )}
    </Section>
  );
};

export default TabSectionSearch;
