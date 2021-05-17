import { useEffect, useState } from 'react';
import TabSection, {
  SectionContainerProps,
  SectionContentByFilter,
  defaultSectionContentByFilter,
} from '.';
import LoadingPage from '../LoadingPage';
import { useAuthContext } from '../Provider';
import { Section } from './TabSection.styled';
import {
  getPaginatedCreationsByCreator,
  getAllCreationsByCreator,
} from '../../services/templates';
import { Template } from '../../services/templates';
import {
  PAGINATION_LIMIT,
  TAB_TYPES,
  CARD_RENDER_TYPES,
  FILTER_TYPES,
} from '../../utils/constants';

export const TabSectionUserProfileCreations = ({
  chainAccount,
  ...tabsProps
}: SectionContainerProps): JSX.Element => {
  const { currentUser } = useAuthContext();
  const [allCreations, setAllCreations] = useState<SectionContentByFilter>(
    defaultSectionContentByFilter
  );
  const [renderedCreations, setRenderedCreations] = useState<Template[]>([]);
  const [nextPageNumber, setNextPageNumber] = useState<number>(2);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [isLoadingInitialMount, setIsLoadingInitialMount] = useState<boolean>(
    true
  );
  const [creationsFilter, setCreationsFilter] = useState<string>(
    FILTER_TYPES.RECENTLY_CREATED
  );

  const isUsersPage = currentUser && currentUser.actor === chainAccount;

  useEffect(() => {
    (async () => {
      if (chainAccount) {
        try {
          setIsFetching(true);
          setIsLoadingInitialMount(true);

          const initialRenderedCreations = await getPaginatedCreationsByCreator(
            {
              chainAccount,
              hasAssets: !isUsersPage,
              page: 1,
            }
          );
          setRenderedCreations(initialRenderedCreations);
          setIsLoadingInitialMount(false);
          setNextPageNumber(
            initialRenderedCreations.length < PAGINATION_LIMIT ? -1 : 2
          );

          const creations = await getAllCreationsByCreator({
            chainAccount,
            hasAssets: !isUsersPage,
          });

          const allCreationsByFilter = {
            [FILTER_TYPES.NAME]: creations
              .slice()
              .sort((a, b) =>
                a.name.toLowerCase().localeCompare(b.name.toLowerCase())
              ),
            [FILTER_TYPES.RECENTLY_CREATED]: creations,
          };

          setAllCreations(allCreationsByFilter);
          setIsFetching(false);
        } catch (e) {
          console.warn(e.message);
          setIsFetching(false);
          setIsLoadingInitialMount(false);
        }
      }
    })();
  }, [chainAccount]);

  const showNextCreationsPage = async () => {
    const numNextPageItems = allCreations[creationsFilter].slice(
      (nextPageNumber - 1) * PAGINATION_LIMIT,
      nextPageNumber * PAGINATION_LIMIT
    ).length;

    setRenderedCreations(
      allCreations[creationsFilter].slice(0, nextPageNumber * PAGINATION_LIMIT)
    );
    setNextPageNumber((prevPageNumber) =>
      numNextPageItems < PAGINATION_LIMIT ? -1 : prevPageNumber + 1
    );
  };

  const handleCreationsFilterClick = (filter: string) => {
    setCreationsFilter(filter);
    const pageOneItems = allCreations[filter].slice(0, PAGINATION_LIMIT);
    setRenderedCreations(pageOneItems);
    setNextPageNumber(pageOneItems.length < PAGINATION_LIMIT ? -1 : 2);
  };

  return (
    <Section isHidden={tabsProps.activeTab !== TAB_TYPES.CREATIONS}>
      {isLoadingInitialMount ? (
        <LoadingPage margin="10% 0" />
      ) : (
        <TabSection
          type={CARD_RENDER_TYPES.TEMPLATE}
          showNextPage={showNextCreationsPage}
          isFetching={isFetching}
          rendered={renderedCreations}
          nextPageNumber={nextPageNumber}
          tabsProps={tabsProps}
          filterDropdownProps={{
            activeFilter: creationsFilter,
            handleFilterClick: handleCreationsFilterClick,
          }}
          emptyContent={{
            subtitle: isUsersPage
              ? 'Looks like you have not created any NFT’s yet. Come back when you do!'
              : 'Looks like this user does not have any creations yet.',
            buttonTitle: 'Create NFT',
            link: '/create',
          }}
        />
      )}
    </Section>
  );
};
