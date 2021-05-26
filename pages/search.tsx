import { useState } from 'react';
import { useRouter } from 'next/router';
import PageLayout from '../components/PageLayout';
import { Title } from '../styles/Title.styled';
import { TAB_TYPES } from '../utils/constants';
import TabSectionSearch from '../components/TabSection/TabSectionSearch';

const Search = (): JSX.Element => {
  const router = useRouter();
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
      <TabSectionSearch
        searchContentType="templates"
        {...tabsProps}
        query={searchTerm}
      />
      <TabSectionSearch
        searchContentType="authors"
        {...tabsProps}
        query={searchTerm}
      />
      <TabSectionSearch
        searchContentType="collections"
        {...tabsProps}
        query={searchTerm}
      />
    </PageLayout>
  );
};

export default Search;
