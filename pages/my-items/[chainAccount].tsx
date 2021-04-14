import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PageLayout from '../../components/PageLayout';
import PaginationButton from '../../components/PaginationButton';
import ErrorComponent from '../../components/Error';
import Grid from '../../components/Grid';
import { MODAL_TYPES, useAuthContext } from '../../components/Provider';
import {
  getTemplatesWithUserAssetCount,
  getUserCreatedTemplates,
} from '../../services/templates';
import { Template } from '../../services/templates';
import LoadingPage from '../../components/LoadingPage';
import { capitalize } from '../../utils';
import { PAGINATION_LIMIT } from '../../utils/constants';
import Banner from '../../components/Banner';
import ProfileTabs from '../../components/ProfileTabs';
import PageHeader from '../../components/PageHeader';
import proton from '../../services/proton-rpc';
import EmptyUserContent from '../../components/EmptyUserContent';

type RouterQuery = {
  chainAccount: string;
};

type GetMyTemplatesOptions = {
  chainAccount: string;
  type: string;
  page?: number;
};

const getMyTemplates = async ({
  chainAccount,
  type,
  page,
}: GetMyTemplatesOptions): Promise<Template[]> => {
  try {
    const pageParam = page ? page : 1;
    let result;
    if (type === 'ITEMS') {
      result = await getTemplatesWithUserAssetCount(chainAccount, pageParam);
    } else {
      result = await getUserCreatedTemplates(chainAccount, pageParam);
    }
    return result;
  } catch (e) {
    throw new Error(e);
  }
};

const Collection = (): JSX.Element => {
  const TAB_TYPES = {
    ITEMS: 'ITEMS',
    CREATIONS: 'CREATIONS',
  };

  const router = useRouter();
  const { chainAccount } = router.query as RouterQuery;
  const { currentUser, isLoadingUser } = useAuthContext();
  const [renderedTemplates, setRenderedTemplates] = useState<Template[]>([]);
  const [prefetchedTemplates, setPrefetchedTemplates] = useState<Template[]>(
    []
  );
  const [prefetchPageNumber, setPrefetchPageNumber] = useState<number>(2);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState<boolean>(true);
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(true);
  const [isTemplatesLoading, setIsTemplatesLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [currentProfile, setCurrentProfile] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userAvatar, setUserAvatar] = useState<string>('/default-avatar.png');

  const getTitle = () => {
    return currentUser && currentUser.actor !== chainAccount && userName
      ? `${userName.split(' ')[0]}'s Items`
      : 'My Items';
  };

  const tabs = [
    { title: getTitle(), type: TAB_TYPES.ITEMS },
    { title: 'Creations', type: TAB_TYPES.CREATIONS },
  ];
  const [activeTab, setActiveTab] = useState<string>(tabs[0].type);

  const prefetchNextPage = async () => {
    const prefetchedResult = await getMyTemplates({
      chainAccount,
      page: prefetchPageNumber,
      type: activeTab,
    });
    setPrefetchedTemplates(prefetchedResult);

    if (!prefetchedResult.length) {
      setPrefetchPageNumber(-1);
    } else {
      setPrefetchPageNumber(prefetchPageNumber + 1);
    }

    setIsLoadingNextPage(false);
  };

  const showNextPage = async () => {
    const allFetchedTemplates = renderedTemplates.concat(prefetchedTemplates);
    setRenderedTemplates(allFetchedTemplates);
    setIsLoadingNextPage(true);
    await prefetchNextPage();
  };

  const getUser = async (chainAccount: string): Promise<void> => {
    setIsProfileLoading(true);

    if (chainAccount) {
      const user = await proton.getUserByChainAccount({
        account: chainAccount,
      });
      const { name, avatar } = user;
      setUserName(name);
      setUserAvatar(avatar);
      if (!currentUser || chainAccount !== currentUser.actor) {
        setCurrentProfile(capitalize(chainAccount));
      } else {
        setCurrentProfile('');
      }
    }
  };

  const resetStates = () => {
    setRenderedTemplates([]);
    setPrefetchedTemplates([]);
    setPrefetchPageNumber(2);
    setIsTemplatesLoading(true);
  };

  useEffect(() => {
    (async () => {
      if (chainAccount) {
        try {
          setIsTemplatesLoading(true);
          router.prefetch('/');
          const templates = await getMyTemplates({
            chainAccount,
            type: activeTab,
          });
          setRenderedTemplates(templates);
          await prefetchNextPage();
        } catch (e) {
          setErrorMessage(e.message);
        }
      }
      setIsLoading(false);
      setIsTemplatesLoading(false);
    })();
  }, [activeTab, chainAccount]);

  useEffect(() => {
    (async () => {
      try {
        await getUser(chainAccount);
      } catch (e) {
        setErrorMessage(e.message);
      }
      setIsProfileLoading(false);
    })();
  }, [currentUser, chainAccount]);

  const getContentItems = () => {
    if (isTemplatesLoading || isLoadingUser) {
      return <LoadingPage margin="10% 0" />;
    }

    if (!renderedTemplates.length && activeTab === 'ITEMS') {
      return (
        <EmptyUserContent
          subtitle={
            chainAccount !== currentUser.actor
              ? 'Looks like this user has not bought any NFT’s yet.'
              : 'Looks like you have not bought any NFT’s yet. Come back when you do!'
          }
          buttonTitle="Explore NFTs"
          link="/"
        />
      );
    }

    if (!renderedTemplates.length && activeTab === 'CREATIONS') {
      return (
        <EmptyUserContent
          subtitle={
            chainAccount !== currentUser.actor
              ? 'Looks like this user does not have any creations yet.'
              : 'Looks like you have not created any NFT’s yet. Come back when you do!'
          }
          buttonTitle="Create NFT"
          link="/create"
        />
      );
    }

    return <Grid items={renderedTemplates} />;
  };

  const getContent = () => {
    if (isLoading || isProfileLoading || isLoadingUser) {
      return <LoadingPage />;
    }

    if (errorMessage) {
      return (
        <ErrorComponent
          errorMessage={errorMessage}
          buttonText="Try again"
          buttonOnClick={() => router.reload()}
        />
      );
    }

    return (
      <>
        <PageHeader
          image={userAvatar}
          name={capitalize(userName)}
          subName={chainAccount}
          type="user"
        />
        <ProfileTabs
          tabList={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          resetStates={resetStates}
        />
        {getContentItems()}
        <PaginationButton
          onClick={showNextPage}
          isHidden={renderedTemplates.length < PAGINATION_LIMIT}
          isLoading={isLoadingNextPage}
          disabled={prefetchPageNumber === -1}
        />
      </>
    );
  };

  return (
    <>
      <PageLayout title={getTitle()}>
        <Banner modalType={MODAL_TYPES.CLAIM} />
        {getContent()}
      </PageLayout>
    </>
  );
};

export default Collection;
