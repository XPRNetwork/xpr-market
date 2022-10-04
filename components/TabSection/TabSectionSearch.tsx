import { FC, useEffect, useState } from 'react';
import TabSection, { SectionContainerProps } from '.';
import LoadingPage from '../LoadingPage';
import { Section } from '../../styles/index.styled';
import {
  SearchResultsByType,
  SearchAuthor,
  SearchCollection,
} from '../../services/search';
import { Template } from '../../services/templates';
import { TAB_TYPES, CARD_RENDER_TYPES, Filter } from '../../utils/constants';
import { getFromApi } from '../../utils/browser-fetch';

const emptyFilterObject = { label: '', queryParam: '' };

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

const TabSectionSearch: FC<Props> = ({
  query = '',
  searchContentType = '',
  ...tabsProps
}) => {
  const [renderedItems, setRenderedItems] = useState<
    (Template | SearchAuthor | SearchCollection)[]
  >([]);
  const [prefetchedItems, setPrefetchedItems] = useState<
    (Template | SearchAuthor | SearchCollection)[]
  >([]);
  const [isLoadingPrices, setIsLoadingPrices] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [isLoadingInitialMount, setIsLoadingInitialMount] = useState<boolean>(
    true
  );
  const [prefetchPageNumber, setPrefetchPageNumber] = useState<number>(2);
  const [filterType, setFilterType] = useState<Filter>(emptyFilterObject);

  useEffect(() => {
    (async () => {
      if (filterType) {
        await fetchNextPage();
      }
    })();
  }, [filterType]);

  useEffect(() => {
    (async () => {
      if (query) {
        setFilterType(emptyFilterObject);
        setPrefetchPageNumber(2);
        setIsLoadingPrices(true);
        setIsLoadingInitialMount(true);

        try {
          const searchResponse = await getSearchResults({
            page: 1,
          });
          setRenderedItems(searchResponse.contents);
          setIsLoadingInitialMount(false);
          setIsLoadingPrices(false);
          await fetchNextPage();
        } catch (e) {
          setIsLoadingInitialMount(false);
        }
      }
    })();
  }, [query]);

  const getSearchResults = async ({
    page,
    sortQueryParams,
  }: {
    page: number;
    sortQueryParams?: string;
  }): Promise<
    SearchResultsByType<Template | SearchAuthor | SearchCollection>
  > => {
    setIsFetching(true);
    const res = await getFromApi<
      SearchResultsByType<Template | SearchAuthor | SearchCollection>
    >(
      `/api/search-by/${searchContentType}?query=${query}&page=${page}${
        sortQueryParams || ''
      }`
    );
    if (!res.success) {
      setIsFetching(false);
      throw new Error(res.error.message);
    }
    setIsFetching(false);
    return res.message;
  };

  const showNextNFTSearchPage = async () => {
    setRenderedItems((prevItems) => [...prevItems, ...prefetchedItems]);
    await fetchNextPage();
  };

  const handleItemsFilterClick = async (filter: Filter) => {
    const getSearchResultsParams = {
      page: 1,
      sortQueryParams: filter.queryParam,
    };
    setPrefetchPageNumber(2);

    if (filter.label !== filterType.label) {
      setFilterType(filter);
    } else {
      setFilterType(emptyFilterObject);
      getSearchResultsParams.sortQueryParams = '';
    }

    const searchResults = await getSearchResults(getSearchResultsParams);
    setRenderedItems(searchResults.contents);
  };

  const fetchNextPage = async () => {
    if (prefetchPageNumber > 0) {
      const searchResponse = await getSearchResults({
        page: prefetchPageNumber,
        sortQueryParams: filterType.queryParam,
      });
      setPrefetchedItems(searchResponse.contents);
      setPrefetchPageNumber((prevPageNumber) =>
        prefetchPageNumber > searchResponse.totalPages ? -1 : prevPageNumber + 1
      );
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
            filters: [],
            // searchContentType !== 'authors'
            //   ? Object.values(FILTER_TYPES)
            //   : [FILTER_TYPES.NAME_AZ, FILTER_TYPES.NAME_ZA],
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
