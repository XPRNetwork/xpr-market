import { useEffect, useState } from 'react';
import ProfileTabSection, { ProfileTabSectionContainerProps } from './';
import ProfileTabs from '../../components/ProfileTabs';
import LoadingPage from '../../components/LoadingPage';
import { useAuthContext } from '../Provider';
import { Row, Section } from '../../styles/index.styled';
import { getUserCreatedTemplates } from '../../services/templates';
import { Template } from '../../services/templates';
import { PAGINATION_LIMIT, TAB_TYPES } from '../../utils/constants';

export const ProfileTabSectionCreations = ({
  chainAccount,
  tabs,
  activeTab,
  setActiveTab,
}: ProfileTabSectionContainerProps): JSX.Element => {
  const { currentUser } = useAuthContext();
  const [renderedCreations, setRenderedCreations] = useState<Template[]>([]);
  const [prefetchedCreations, setPrefetchedCreations] = useState<Template[]>(
    []
  );
  const [prefetchPageNumber, setPrefetchPageNumber] = useState<number>(2);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [isInitialPageLoading, setIsInitialPageLoading] = useState<boolean>(
    true
  );

  const isUsersPage = currentUser && currentUser.actor === chainAccount;

  useEffect(() => {
    (async () => {
      if (chainAccount) {
        try {
          setIsFetching(true);
          setIsInitialPageLoading(true);

          const initialCreations = await getUserCreatedTemplates(
            chainAccount,
            1,
            !isUsersPage
          );
          const creations = await getUserCreatedTemplates(
            chainAccount,
            2,
            !isUsersPage
          );

          setRenderedCreations(initialCreations);
          setPrefetchedCreations(creations);
          setPrefetchPageNumber(creations.length < PAGINATION_LIMIT ? -1 : 3);

          setIsFetching(false);
          setIsInitialPageLoading(false);
        } catch (e) {
          console.warn(e.message);

          setIsFetching(false);
          setIsInitialPageLoading(false);
        }
      }
    })();
  }, [chainAccount]);

  const showNextCreationsPage = async () => {
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
    setPrefetchPageNumber((prevPageNumber) =>
      creations.length < PAGINATION_LIMIT ? -1 : prevPageNumber + 1
    );
    setIsFetching(false);
  };

  return (
    <Section isHidden={activeTab !== TAB_TYPES.CREATIONS}>
      <Row>
        <ProfileTabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </Row>
      {isInitialPageLoading ? (
        <LoadingPage margin="10% 0" />
      ) : (
        <ProfileTabSection
          showNextPage={showNextCreationsPage}
          isFetching={isFetching}
          rendered={renderedCreations}
          prefetchPageNumber={prefetchPageNumber}
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
