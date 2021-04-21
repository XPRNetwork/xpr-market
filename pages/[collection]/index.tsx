import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PageLayout from '../../components/PageLayout';
import Grid from '../../components/Grid';
import PaginationButton from '../../components/PaginationButton';
import ErrorComponent from '../../components/Error';
import LoadingPage from '../../components/LoadingPage';
import {
  Template,
  getTemplatesByCollection,
  formatTemplatesWithPriceData,
  getLowestPricesForAllCollectionTemplates,
} from '../../services/templates';
import {
  getCollection,
  Collection,
  emptyCollection,
} from '../../services/collections';
import { PAGINATION_LIMIT, RouterQuery } from '../../utils/constants';
import Banner from '../../components/Banner';
import { MODAL_TYPES, useAuthContext } from '../../components/Provider';
import PageHeader from '../../components/PageHeader';
import { capitalize } from '../../utils';

const CollectionPage = (): JSX.Element => {
  const router = useRouter();
  const { isLoadingUser } = useAuthContext();
  const { collection: caseSensitiveCollection } = router.query as RouterQuery;
  const collection = caseSensitiveCollection
    ? caseSensitiveCollection.toLowerCase()
    : '';
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
  const [collectionData, setCollectionData] = useState<Collection>(
    emptyCollection
  );

  const prefetchNextPage = async () => {
    const prefetchedResult = await getTemplatesByCollection({
      type: collection,
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
    if (collection && !renderedTemplates.length) {
      (async () => {
        try {
          const collectionResult = await getCollection(collection);
          setCollectionData(collectionResult);
          const lowestPricesResult = await getLowestPricesForAllCollectionTemplates(
            { type: collection }
          );
          setLowestPrices(lowestPricesResult);

          const result = await getTemplatesByCollection({ type: collection });
          const templatesWithLowestPrice = formatTemplatesWithPriceData(
            result,
            lowestPricesResult
          );

          setRenderedTemplates(templatesWithLowestPrice);

          setIsLoading(false);
          await prefetchNextPage();
        } catch (e) {
          setIsLoading(false);
          setErrorMessage(e.message);
        }
      })();
    }
  }, [collection]);

  const getContent = () => {
    if (isLoading || isLoadingUser) {
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

    if (!renderedTemplates.length) {
      return (
        <ErrorComponent errorMessage="No templates were found for this collection type." />
      );
    }

    const {
      name,
      collection_name,
      img,
      data: { description },
    } = collectionData;

    return (
      <>
        <PageHeader
          image={img}
          name={capitalize(name || collection)}
          subName={collection_name}
          description={description}
          type="collection"
        />
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
    <PageLayout title="Collection">
      <Banner modalType={MODAL_TYPES.CLAIM} />
      {getContent()}
    </PageLayout>
  );
};

export default CollectionPage;
