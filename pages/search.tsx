import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PageLayout from '../components/PageLayout';
import Grid from '../components/Grid';
import PaginationButton from '../components/PaginationButton';
import ErrorComponent from '../components/Error';
import { Title } from '../styles/Title.styled';
import { useAuthContext } from '../components/Provider';
import { PAGINATION_LIMIT, CARD_RENDER_TYPES, TAB_TYPES } from '../utils/constants';
import TabSectionSearchTemplates from '../components/TabSection/TabSectionSearchTemplates';

const Search = (): JSX.Element => {
  const router = useRouter();
  const { isLoadingUser } = useAuthContext();
  const [activeTab, setActiveTab] = useState<string>(TAB_TYPES.NFTS);
  const searchTerm = router.query.keywords
    ? (router.query.keywords as string).toLowerCase()
    : '';

  const tabs = [
    { title: 'NFTs', type: TAB_TYPES.NFTS },
    { title: 'Creators', type: TAB_TYPES.CREATORS },
    { title: 'Collections', type: TAB_TYPES.COLLECTIONS },
  ];

  const tabsProps = {
    tabs,
    activeTab,
    setActiveTab,
  };

  return (
    <PageLayout title={`${searchTerm} - Search`}>
      <Title>Search results for “{searchTerm}”</Title>
      <TabSectionSearchTemplates {...tabsProps} query={searchTerm} />
    </PageLayout>
  );
};

export default Search;
