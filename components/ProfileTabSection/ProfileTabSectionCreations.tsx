import { useEffect, useState } from 'react';
import ProfileTabSection from './index';
import ProfileTabs, { ProfileTabsProps } from '../../components/ProfileTabs';
import LoadingPage from '../../components/LoadingPage';
import { useAuthContext } from '../Provider';
import { Row } from '../../styles/index.styled';
import { getUserCreatedTemplates } from '../../services/templates';
import { Template } from '../../services/templates';
import { PAGINATION_LIMIT } from '../../utils/constants';

interface Props extends ProfileTabsProps {
  chainAccount: string;
}

export const ProfileTabSectionCreations = ({
  chainAccount,
  tabs,
  activeTab,
  setActiveTab,
}: Props): JSX.Element => {
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

  if (isInitialPageLoading) {
    return <LoadingPage margin="10% 0" />;
  }

  return (
    <>
      <Row>
        <ProfileTabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </Row>
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
    </>
  );
};
