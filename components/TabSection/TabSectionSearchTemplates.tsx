import { useEffect, useState } from 'react';
import TabSection, { SectionContainerProps } from '.';
import LoadingPage from '../LoadingPage';
import { Section } from '../../styles/index.styled';
import { SearchResultsByType, SearchTemplate } from '../../services/search';
import { TAB_TYPES, CARD_RENDER_TYPES } from '../../utils/constants';
import { getFromApi } from '../../utils/browser-fetch';

interface Props extends SectionContainerProps {
  query: string;
}

const TabSectionSearchTemplates = ({
  query,
  ...tabsProps
}: Props): JSX.Element => {
  const [renderedItems, setRenderedItems] = useState<SearchTemplate[]>([]);
  const [prefetchedItems, setPrefetchedItems] = useState<SearchTemplate[]>([]);
  const [isLoadingPrices, setIsLoadingPrices] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [isLoadingInitialMount, setIsLoadingInitialMount] = useState<boolean>(
    true
  );
  const [prefetchPageNumber, setPrefetchPageNumber] = useState<number>(3);

  useEffect(() => {
    (async () => {
      if (query) {
        setIsFetching(true);
        setIsLoadingPrices(true);
        setIsLoadingInitialMount(true);

        try {
          const res = await getFromApi<SearchResultsByType<SearchTemplate>>(
            `/api/search-by/templates?query=${query}&page=1`
          );

          if (!res.success) throw new Error(res.error.message);
          setRenderedItems(res.message.contents);
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

  const showNextNFTSearchPage = async () => {
    setRenderedItems((prevItems) => [...prevItems, ...prefetchedItems]);
    await fetchNextPage();
  };

  const fetchNextPage = async () => {
    if (prefetchPageNumber > 0) {
      setIsFetching(true);
      const result = await getFromApi<SearchResultsByType<SearchTemplate>>(
        `/api/search-by/templates?query=${query}&page=${prefetchPageNumber}`
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
    <Section isHidden={tabsProps.activeTab !== TAB_TYPES.NFTS}>
      {isLoadingInitialMount ? (
        <LoadingPage margin="10% 0" />
      ) : (
        <TabSection
          showNextPage={showNextNFTSearchPage}
          type={CARD_RENDER_TYPES.SEARCH_TEMPLATE}
          isLoadingPrices={isLoadingPrices}
          isFetching={isFetching}
          rendered={renderedItems}
          nextPageNumber={prefetchPageNumber}
          tabsProps={tabsProps}
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

export default TabSectionSearchTemplates;
