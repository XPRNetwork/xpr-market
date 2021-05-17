import { useEffect, useState } from 'react';
import TabSection, { SectionContainerProps } from '.';
import Tabs from '../Tabs';
import FilterDropdown from '../FilterDropdown';
import LoadingPage from '../LoadingPage';
import { useAuthContext } from '../Provider';
import { Row, Section } from '../../styles/index.styled';
import { getAllTemplatesForUserWithAssetCount } from '../../services/templates';
import {
  Template,
  getLowestPricesByTemplateId,
} from '../../services/templates';
import {
  PAGINATION_LIMIT,
  FILTER_TYPES,
  TAB_TYPES,
  CARD_RENDER_TYPES,
} from '../../utils/constants';
import { getFromApi } from '../../utils/browser-fetch';

interface AllItems {
  [filterType: string]: Template[];
}

const defaultAllItems = {
  [FILTER_TYPES.NAME]: [],
  [FILTER_TYPES.RECENTLY_CREATED]: [],
};

interface Props extends SectionContainerProps {
  query: string;
}

type TemplateSearchResponse = {};

const TabSectionSearchTemplates = ({
  query,
  ...tabsProps
}: Props): JSX.Element => {
  const [renderedItems, setRenderedItems] = useState<Template[]>([]);
  const [prefetchedItems, setPrefetchedItems] = useState<Template[]>([]);
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
          const res = await getFromApi(
            `/api/search-by/templates?query=${query}&page=1`
          );

          if (!res.success) throw new Error(res.message);
          setRenderedItems(res.message.contents);
          console.log(res.message.contents);
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
      const result = await getFromApi(
        `/api/search-by/templates?query=${query}&page=${prefetchPageNumber}`
      );
      setPrefetchedItems(result.message.contents);
      setPrefetchPageNumber((prevPageNumber) => prefetchPageNumber >= result.message.totalPages ? -1 : prevPageNumber + 1);
      setIsFetching(false);
    }
  };

  return (
    <Section isHidden={tabsProps.activeTab !== TAB_TYPES.NFTS}>
      <Row>
        <Tabs {...tabsProps} />
      </Row>
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
