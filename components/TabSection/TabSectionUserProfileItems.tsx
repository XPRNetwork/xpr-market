import { useEffect, useState } from 'react';
import TabSection, { SectionContainerProps } from '.';
import Tabs from '../Tabs';
import FilterDropdown from '../FilterDropdown';
import LoadingPage from '../LoadingPage';
import { useAuthContext } from '../Provider';
import { Row, Section } from './TabSection.styled';
import { getAllTemplatesForUserWithAssetCount } from '../../services/templates';
import {
  Template,
  getLowestPricesByTemplateId,
} from '../../services/templates';
import {
  PAGINATION_LIMIT,
  FILTER_TYPES,
  TAB_TYPES,
} from '../../utils/constants';

interface AllItems {
  [filterType: string]: Template[];
}

const defaultAllItems = {
  [FILTER_TYPES.NAME]: [],
  [FILTER_TYPES.RECENTLY_CREATED]: [],
};

export const TabSectionUserProfileItems = ({
  chainAccount,
  ...tabsProps
}: SectionContainerProps): JSX.Element => {
  const { currentUser } = useAuthContext();
  const [allItems, setAllItems] = useState<AllItems>(defaultAllItems);
  const [renderedItems, setRenderedItems] = useState<Template[]>([]);
  const [nextPageNumber, setNextPageNumber] = useState<number>(2);
  const [isLoadingPrices, setIsLoadingPrices] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [isLoadingInitialMount, setIsLoadingInitialMount] = useState<boolean>(
    true
  );
  const [itemsFilter, setItemsFilter] = useState<string>(
    FILTER_TYPES.RECENTLY_CREATED
  );

  const isUsersPage = currentUser && currentUser.actor === chainAccount;

  useEffect(() => {
    (async () => {
      if (chainAccount) {
        setIsFetching(true);
        setIsLoadingPrices(true);
        setIsLoadingInitialMount(true);

        try {
          const {
            templates,
            collectionNames,
          } = await getAllTemplatesForUserWithAssetCount(chainAccount);
          const allItemsByFilter = {
            [FILTER_TYPES.NAME]: templates
              .slice()
              .sort((a, b) =>
                a.name.toLowerCase().localeCompare(b.name.toLowerCase())
              ),
            [FILTER_TYPES.RECENTLY_CREATED]: templates,
          };

          setAllItems(allItemsByFilter);
          setRenderedItems(
            allItemsByFilter[itemsFilter].slice(0, PAGINATION_LIMIT)
          );
          setIsFetching(false);
          setIsLoadingInitialMount(false);

          const prices = await getLowestPricesByTemplateId(collectionNames);
          const templatesWithPrices = templates.map((template) => ({
            ...template,
            lowestPrice: prices[template.template_id],
          }));
          const allItemsByFilterWithPrices = {
            [FILTER_TYPES.NAME]: templatesWithPrices
              .slice()
              .sort((a, b) =>
                a.name.toLowerCase().localeCompare(b.name.toLowerCase())
              ),
            [FILTER_TYPES.RECENTLY_CREATED]: templatesWithPrices,
          };

          setIsLoadingPrices(false);
          setAllItems(allItemsByFilterWithPrices);
          setRenderedItems(
            allItemsByFilterWithPrices[itemsFilter].slice(0, PAGINATION_LIMIT)
          );
        } catch (e) {
          console.warn(e.message);
          setIsFetching(false);
          setIsLoadingPrices(false);
          setIsLoadingInitialMount(false);
        }
      }
    })();
  }, [chainAccount]);

  const showNextItemsPage = async () => {
    const numNextPageItems = allItems[itemsFilter].slice(
      (nextPageNumber - 1) * PAGINATION_LIMIT,
      nextPageNumber * PAGINATION_LIMIT
    ).length;

    setRenderedItems(
      allItems[itemsFilter].slice(0, nextPageNumber * PAGINATION_LIMIT)
    );
    setNextPageNumber((prevPageNumber) =>
      numNextPageItems < PAGINATION_LIMIT ? -1 : prevPageNumber + 1
    );
  };

  const handleItemsFilterClick = (filter: string) => {
    setItemsFilter(filter);
    const pageOneItems = allItems[filter].slice(0, PAGINATION_LIMIT);
    setRenderedItems(pageOneItems);
    setNextPageNumber(pageOneItems.length < PAGINATION_LIMIT ? -1 : 2);
  };

  return (
    <Section isHidden={tabsProps.activeTab !== TAB_TYPES.ITEMS}>
      <Row>
        <Tabs {...tabsProps} />
        <FilterDropdown
          activeFilter={itemsFilter}
          handleFilterClick={handleItemsFilterClick}
        />
      </Row>
      {isLoadingInitialMount ? (
        <LoadingPage margin="10% 0" />
      ) : (
        <TabSection
          showNextPage={showNextItemsPage}
          isLoadingPrices={isLoadingPrices}
          isFetching={isFetching}
          rendered={renderedItems}
          nextPageNumber={nextPageNumber}
          emptyContent={{
            subtitle: isUsersPage
              ? 'Looks like you have not bought any NFT’s yet. Come back when you do!'
              : 'Looks like this user has not bought any NFT’s yet.',
            buttonTitle: 'Explore NFTs',
            link: '/',
          }}
        />
      )}
    </Section>
  );
};
