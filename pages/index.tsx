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
import { MODAL_TYPES } from '../components/Provider';

const FEATURED = ['madisyn', 'moonboysnfts', 'xelements'];

const MarketPlace = (): JSX.Element => {
  const router = useRouter();
  const getCollections = () =>
    FEATURED.map((collection, i) => {
      const redirectToCollection = () => router.push(`/${collection}`);
      return (
        <>
          <CollectionTitleRow margin={i == 0 ? '0 0 32px' : '52px 0 32px'}>
            <CollectionTitle onClick={redirectToCollection}>
              {collection}
            </CollectionTitle>
            <TextButton onClick={redirectToCollection}>See all</TextButton>
          </CollectionTitleRow>
          <FeaturedGrid collection={collection} />
        </>
      );
    });
  return (
    <PageLayout title="Featured Collections">
      <Banner modalType={MODAL_TYPES.CLAIM} />
      <ExploreCard />
      <Title>Featured Collections 🏆</Title>
      {getCollections()}
    </PageLayout>
  );
};

export default MarketPlace;
