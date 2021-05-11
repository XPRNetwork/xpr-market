import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PageLayout from '../../components/PageLayout';
import PaginationButton from '../../components/PaginationButton';
import ErrorComponent from '../../components/Error';
import Grid from '../../components/Grid';
import FilterDropdown from '../../components/FilterDropdown';
import LoadingPage from '../../components/LoadingPage';
import Banner from '../../components/Banner';
import ProfileTabs from '../../components/ProfileTabs';
import PageHeader from '../../components/PageHeader';
import EmptyUserContent from '../../components/EmptyUserContent';
import { MODAL_TYPES, useAuthContext } from '../../components/Provider';
import { Row } from '../../styles/index.styled';
import {
  getAllTemplatesForUserWithAssetCount,
  getUserCreatedTemplates,
} from '../../services/templates';
import {
  Template,
  getLowestPricesByTemplateId,
} from '../../services/templates';
import {
  PAGINATION_LIMIT,
  TAB_TYPES,
  FILTER_TYPES,
  RouterQuery,
  CARD_RENDER_TYPES,
} from '../../utils/constants';
import proton from '../../services/proton-rpc';

const Collection = (): JSX.Element => {
  const router = useRouter();
  const {
    chainAccount: caseSensitiveChainAccount,
  } = router.query as RouterQuery;
  const chainAccount = caseSensitiveChainAccount
    ? caseSensitiveChainAccount.toLowerCase()
    : '';
  const { currentUser, isLoadingUser } = useAuthContext();
  const [allItems, setAllItems] = useState<{
    [type: string]: Template[];
  }>({
    [FILTER_TYPES.NAME]: [],
    [FILTER_TYPES.RECENTLY_CREATED]: [],
  });
  const [renderedItems, setRenderedItems] = useState<Template[]>([]);
  const [
    prefetchItemsPageNumber,
    setPrefetchItemsPageNumber,
  ] = useState<number>(2);
  const [renderedCreations, setRenderedCreations] = useState<Template[]>([]);
  const [prefetchedCreations, setPrefetchedCreations] = useState<Template[]>(
    []
  );
  const [
    prefetchCreationsPageNumber,
    setPrefetchCreationsPageNumber,
  ] = useState<number>(2);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState<boolean>(true);
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(true);
  const [isLoadingPrices, setIsLoadingPrices] = useState<boolean>(true);
  const [isInitialPageLoading, setIsInitialPageLoading] = useState<boolean>(
    true
  );
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLightKYCVerified, setIsLightKYCVerified] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [userAvatar, setUserAvatar] = useState<string>('/default-avatar.png');
  const [itemsFilter, setItemsFilter] = useState<string>(FILTER_TYPES.NAME);
  const isUsersPage = currentUser && currentUser.actor === chainAccount;

  const getTitle = () => {
    return !currentUser || (currentUser && currentUser.actor !== chainAccount)
      ? `${userName ? userName.split(' ')[0] : chainAccount}'s Items`
      : 'My Items';
  };

  const tabs = [
    { title: getTitle(), type: TAB_TYPES.ITEMS },
    { title: 'Creations', type: TAB_TYPES.CREATIONS },
  ];
  const [activeTab, setActiveTab] = useState<string>(tabs[0].type);

  const handleItemsFilterClick = (filter: string) => {
    setItemsFilter(filter);
    const pageOneItems = allItems[filter].slice(0, PAGINATION_LIMIT);
    setRenderedItems(pageOneItems);
    setPrefetchItemsPageNumber(pageOneItems.length < PAGINATION_LIMIT ? -1 : 2);
  };

  const showNextItemsPage = async () => {
    const numNextPageItems = allItems[itemsFilter].slice(
      (prefetchItemsPageNumber - 1) * PAGINATION_LIMIT,
      prefetchItemsPageNumber * PAGINATION_LIMIT
    ).length;
    setRenderedItems(
      allItems[itemsFilter].slice(0, prefetchItemsPageNumber * PAGINATION_LIMIT)
    );
    setPrefetchItemsPageNumber((prevPageNumber) =>
      numNextPageItems < PAGINATION_LIMIT ? -1 : prevPageNumber + 1
    );
  };

  const showNextCreationsPage = async () => {
    setRenderedCreations((prevCreations) => [
      ...prevCreations,
      ...prefetchedCreations,
    ]);
    setIsLoadingNextPage(true);
    const creations = await getUserCreatedTemplates(
      chainAccount,
      prefetchCreationsPageNumber,
      !isUsersPage
    );
    setPrefetchedCreations(creations);
    setIsLoadingNextPage(false);
    setPrefetchCreationsPageNumber((prevPageNumber) =>
      creations.length < PAGINATION_LIMIT ? -1 : prevPageNumber + 1
    );
  };

  const getUser = async (chainAccount: string): Promise<void> => {
    setIsProfileLoading(true);

    if (chainAccount) {
      const user = await proton.getUserByChainAccount(chainAccount);
      const isVerified = await proton.isAccountLightKYCVerified(chainAccount);
      setIsLightKYCVerified(isVerified);
      const { name, avatar } = user;
      setUserName(name);
      setUserAvatar(avatar);
    }
  };

  useEffect(() => {
    (async () => {
      if (chainAccount) {
        try {
          setIsInitialPageLoading(true);
          setIsLoadingNextPage(true);
          router.prefetch('/');

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
          setPrefetchCreationsPageNumber(
            creations.length < PAGINATION_LIMIT ? -1 : 3
          );

          setIsLoading(false);
          setIsInitialPageLoading(false);
          setIsLoadingNextPage(false);

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

          setAllItems(allItemsByFilterWithPrices);
          setRenderedItems(
            allItemsByFilterWithPrices[itemsFilter].slice(0, PAGINATION_LIMIT)
          );

          setIsLoadingPrices(false);
        } catch (e) {
          setErrorMessage(e.message);
          setIsLoading(false);
          setIsInitialPageLoading(false);
          setIsLoadingNextPage(false);
          setIsLoadingPrices(false);
        }
      }
    })();
  }, [chainAccount]);

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
    if (isInitialPageLoading || isLoadingUser) {
      return <LoadingPage margin="10% 0" />;
    }

    if (!renderedItems.length && activeTab === TAB_TYPES.ITEMS) {
      return (
        <EmptyUserContent
          subtitle={
            isUsersPage
              ? 'Looks like you have not bought any NFT’s yet. Come back when you do!'
              : 'Looks like this user has not bought any NFT’s yet.'
          }
          buttonTitle="Explore NFTs"
          link="/"
        />
      );
    }

    if (!renderedCreations.length && activeTab === TAB_TYPES.CREATIONS) {
      return (
        <EmptyUserContent
          subtitle={
            isUsersPage
              ? 'Looks like you have not created any NFT’s yet. Come back when you do!'
              : 'Looks like this user does not have any creations yet.'
          }
          buttonTitle="Create NFT"
          link="/create"
        />
      );
    }

    return (
      <Grid
        isLoadingPrices={isLoadingPrices}
        type={CARD_RENDER_TYPES.TEMPLATE}
        items={
          activeTab === TAB_TYPES.ITEMS ? renderedItems : renderedCreations
        }
      />
    );
  };

  const getPaginationButton = () => {
    const isHidden =
      isLoading || (!isLoading && activeTab === TAB_TYPES.ITEMS)
        ? prefetchItemsPageNumber === -1
        : prefetchCreationsPageNumber === -1;

    const isDisabled =
      isLoading || (!isLoading && activeTab === TAB_TYPES.ITEMS)
        ? renderedItems.length < PAGINATION_LIMIT
        : renderedCreations.length < PAGINATION_LIMIT;

    return (
      <PaginationButton
        onClick={
          activeTab === TAB_TYPES.ITEMS
            ? showNextItemsPage
            : showNextCreationsPage
        }
        isHidden={isHidden}
        isLoading={isLoadingNextPage}
        disabled={isDisabled}
        autoLoad
      />
    );
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

    const isItemsTabOpen = activeTab === TAB_TYPES.ITEMS;
    const filterDropdownProps = isItemsTabOpen
      ? {
          filters: [FILTER_TYPES.NAME, FILTER_TYPES.RECENTLY_CREATED],
          activeFilter: itemsFilter,
          handleFilterClick: handleItemsFilterClick,
        }
      : {
          // TODO: Add creations FilterDropdown props
          filters: [],
          activeFilter: '',
          handleFilterClick: () => {},
        };

    return (
      <>
        <PageHeader
          image={userAvatar}
          name={userName}
          subName={chainAccount}
          isLightKYCVerified={isLightKYCVerified}
          type="user"
        />
        <Row>
          <ProfileTabs
            tabList={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          {isItemsTabOpen && <FilterDropdown {...filterDropdownProps} />}
        </Row>
        {getContentItems()}
        {getPaginationButton()}
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
