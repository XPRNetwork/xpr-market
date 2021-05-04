import { Fragment } from 'react';
import { useRouter } from 'next/router';
import {
  Title,
  CollectionTitle,
  CollectionTitleRow,
} from '../styles/Title.styled';
import { TextButton } from '../components/Button/Button.styled';
import PageLayout from '../components/PageLayout';
import ExploreCard from '../components/ExploreCard';
import Banner from '../components/Banner';
import FeaturedGrid from '../components/FeaturedGrid'; // Using FeaturedGrid component to potentially easily swap out with FeaturedCarousel component
import HomepageStatistics from '../components/HomepageStatistics';
import { MODAL_TYPES } from '../components/Provider';
import { useFirebaseFeaturedCollections } from '../services/firebase';

const MarketPlace = (): JSX.Element => {
  const router = useRouter();
  const featuredCollections = useFirebaseFeaturedCollections();
  const getCollections = () =>
    featuredCollections.map(({ collection_name, name, order }) => {
      const redirectToCollection = () => router.push(`/${collection_name}`);
      return (
        <Fragment key={collection_name}>
          <CollectionTitleRow margin={order === 1 ? '0 0 32px' : '52px 0 32px'}>
            <CollectionTitle onClick={redirectToCollection}>
              {name}
            </CollectionTitle>
            <TextButton onClick={redirectToCollection}>See all</TextButton>
          </CollectionTitleRow>
          <FeaturedGrid collection={collection_name} />
        </Fragment>
      );
    });
  return (
    <PageLayout>
      <Banner modalType={MODAL_TYPES.CLAIM} />
      <ExploreCard />
      <HomepageStatistics />
      <Title>Featured Collections 🏆</Title>
      {getCollections()}
    </PageLayout>
  );
};

export default MarketPlace;
