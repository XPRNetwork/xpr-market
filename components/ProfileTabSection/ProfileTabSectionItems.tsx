import { useEffect, useState } from 'react';
import ProfileTabSection, { ProfileTabSectionContainerProps } from './';
import ProfileTabs from '../../components/ProfileTabs';
import FilterDropdown from '../../components/FilterDropdown';
import LoadingPage from '../../components/LoadingPage';
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
} from '../../utils/constants';

export const ProfileTabSectionItems = ({
  chainAccount,
  tabs,
  activeTab,
  setActiveTab,
}: ProfileTabSectionContainerProps): JSX.Element => {
  const { currentUser } = useAuthContext();
  const [allItems, setAllItems] = useState<{
    [type: string]: Template[];
  }>({
    [FILTER_TYPES.NAME]: [],
    [FILTER_TYPES.RECENTLY_CREATED]: [],
  });
  const [renderedItems, setRenderedItems] = useState<Template[]>([]);
  const [prefetchPageNumber, setPrefetchPageNumber] = useState<number>(2);
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
      (prefetchPageNumber - 1) * PAGINATION_LIMIT,
      prefetchPageNumber * PAGINATION_LIMIT
    ).length;

    setRenderedItems(
      allItems[itemsFilter].slice(0, prefetchPageNumber * PAGINATION_LIMIT)
    );
    setPrefetchPageNumber((prevPageNumber) =>
      numNextPageItems < PAGINATION_LIMIT ? -1 : prevPageNumber + 1
    );
  };

  const handleItemsFilterClick = (filter: string) => {
    setItemsFilter(filter);
    const pageOneItems = allItems[filter].slice(0, PAGINATION_LIMIT);
    setRenderedItems(pageOneItems);
    setPrefetchPageNumber(pageOneItems.length < PAGINATION_LIMIT ? -1 : 2);
  };

  return (
    <Section isHidden={activeTab !== TAB_TYPES.ITEMS}>
      <Row>
        <ProfileTabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <FilterDropdown
          activeFilter={itemsFilter}
          handleFilterClick={handleItemsFilterClick}
        />
      </Row>
      {isLoadingInitialMount ? (
        <LoadingPage margin="10% 0" />
      ) : (
        <ProfileTabSection
          showNextPage={showNextItemsPage}
          isLoadingPrices={isLoadingPrices}
          isFetching={isFetching}
          rendered={renderedItems}
          prefetchPageNumber={prefetchPageNumber}
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
