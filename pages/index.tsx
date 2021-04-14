import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PageLayout from '../components/PageLayout';
import Grid from '../components/Grid';
import PaginationButton from '../components/PaginationButton';
import ErrorComponent from '../components/Error';
import LoadingPage from '../components/LoadingPage';
import ExploreCard from '../components/ExploreCard';
import { Title } from '../styles/Title.styled';
import {
  Template,
  getTemplatesByCollection,
  formatTemplatesWithPriceData,
  getLowestPricesForAllCollectionTemplates,
} from '../services/templates';
import { DEFAULT_COLLECTION, PAGINATION_LIMIT } from '../utils/constants';
import Banner from '../components/Banner';
import { MODAL_TYPES, useAuthContext } from '../components/Provider';

const MarketPlace = (): JSX.Element => {
  const router = useRouter();
  const { currentUser, isLoadingUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lowestPrices, setLowestPrices] = useState<{ [id: string]: string }>(
    {}
  );
  const [renderedTemplates, setRenderedTemplates] = useState<Template[]>([]);
  const [prefetchedTemplates, setPrefetchedTemplates] = useState<Template[]>(
    []
  );
  const [prefetchPageNumber, setPrefetchPageNumber] = useState<number>(2);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const prefetchNextPage = async () => {
    const prefetchedResult = await getTemplatesByCollection({
      type: DEFAULT_COLLECTION,
      page: prefetchPageNumber,
    });
    setPrefetchedTemplates(prefetchedResult as Template[]);

    if (!prefetchedResult.length) {
      setPrefetchPageNumber(-1);
    } else {
      setPrefetchPageNumber(prefetchPageNumber + 1);
    }

    setIsLoadingNextPage(false);
  };

  const showNextPage = async () => {
    const allFetchedTemplates = formatTemplatesWithPriceData(
      renderedTemplates.concat(prefetchedTemplates),
      lowestPrices
    );
    setRenderedTemplates(allFetchedTemplates);
    setIsLoadingNextPage(true);
    await prefetchNextPage();
  };

  useEffect(() => {
    (async () => {
      try {
        const lowestPricesResult = await getLowestPricesForAllCollectionTemplates(
          { type: DEFAULT_COLLECTION }
        );
        setLowestPrices(lowestPricesResult);

        const result = await getTemplatesByCollection({
          type: DEFAULT_COLLECTION,
        });
        const templatesWithLowestPrice = formatTemplatesWithPriceData(
          result,
          lowestPricesResult
        );
        setRenderedTemplates(templatesWithLowestPrice);

        setIsLoading(false);
        await prefetchNextPage();
      } catch (e) {
        setErrorMessage(e.message);
      }
    })();
  }, []);

  useEffect(() => {
    if (currentUser) {
      router.prefetch(`/collection/${currentUser.actor}`);
    }
  }, []);

  const getContent = () => {
    if (isLoading || isLoadingUser) {
      return <LoadingPage />;
    }

    if (!renderedTemplates.length) {
      return (
        <ErrorComponent errorMessage="No templates were found for this collection type." />
      );
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
        <Grid items={renderedTemplates} />
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
    <PageLayout title="MarketPlace">
      <Banner modalType={MODAL_TYPES.CLAIM} />
      <ExploreCard />
      <Title>MarketPlace</Title>
      {getContent()}
    </PageLayout>
  );
};

export default MarketPlace;
