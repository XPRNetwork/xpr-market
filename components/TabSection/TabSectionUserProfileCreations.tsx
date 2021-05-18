import { useEffect, useState } from 'react';
import TabSection, { SectionContainerProps } from '.';
import Tabs from '../Tabs';
import LoadingPage from '../LoadingPage';
import { useAuthContext } from '../Provider';
import { Row, Section } from './TabSection.styled';
import { getUserCreatedTemplates } from '../../services/templates';
import { Template } from '../../services/templates';
import {
  PAGINATION_LIMIT,
  TAB_TYPES,
  CARD_RENDER_TYPES,
} from '../../utils/constants';

export const TabSectionUserProfileCreations = ({
  chainAccount,
  ...tabsProps
}: SectionContainerProps): JSX.Element => {
  const { currentUser } = useAuthContext();
  const [renderedCreations, setRenderedCreations] = useState<Template[]>([]);
  const [prefetchedCreations, setPrefetchedCreations] = useState<Template[]>(
    []
  );
  const [prefetchPageNumber, setPrefetchPageNumber] = useState<number>(2);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [isLoadingInitialMount, setIsLoadingInitialMount] = useState<boolean>(
    true
  );

  const isUsersPage = currentUser && currentUser.actor === chainAccount;

  useEffect(() => {
    (async () => {
      if (chainAccount) {
        try {
          setIsFetching(true);
          setIsLoadingInitialMount(true);

          const initialCreations = await getUserCreatedTemplates(
            chainAccount,
            1,
            !isUsersPage
          );
          setIsLoadingInitialMount(false);

          const initialPrefetchedCreations = await getUserCreatedTemplates(
            chainAccount,
            2,
            !isUsersPage
          );
          setIsFetching(false);

          setRenderedCreations(initialCreations);
          setPrefetchedCreations(initialPrefetchedCreations);
          setPrefetchPageNumber(
            initialPrefetchedCreations.length < PAGINATION_LIMIT ? -1 : 3
          );
        } catch (e) {
          console.warn(e.message);
          setIsFetching(false);
          setIsLoadingInitialMount(false);
        }
      }
    })();
  }, [chainAccount]);

  const showNextCreationsPage = async () => {
    setPrefetchPageNumber((prevPageNumber) =>
      prefetchedCreations.length < PAGINATION_LIMIT ? -1 : prevPageNumber + 1
    );

    setRenderedCreations((prevCreations) => [
      ...prevCreations,
      ...prefetchedCreations,
    ]);

    setIsFetching(true);
    const creations = await getUserCreatedTemplates(
      chainAccount,
      prefetchPageNumber,
      !isUsersPage
    );

    setPrefetchedCreations(creations);
    setIsFetching(false);
  };

  return (
    <Section isHidden={tabsProps.activeTab !== TAB_TYPES.CREATIONS}>
      <Row>
        <Tabs {...tabsProps} />
      </Row>
      {isLoadingInitialMount ? (
        <LoadingPage margin="10% 0" />
      ) : (
        <TabSection
          type={CARD_RENDER_TYPES.TEMPLATE}
          showNextPage={showNextCreationsPage}
          isFetching={isFetching}
          rendered={renderedCreations}
          nextPageNumber={prefetchPageNumber}
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
