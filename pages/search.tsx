import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PageLayout from '../components/PageLayout';
import { Title } from '../styles/Title.styled';
import {
  Template,
  getTemplatesByCollection,
  formatTemplatesWithPriceData,
  getLowestPricesForAllCollectionTemplates,
} from '../services/templates';

const Search = (): JSX.Element => {
  const router = useRouter();
  const collectionType = router.query.keywords
    ? (router.query.keywords as string).toLowerCase()
    : '';
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lowestPrices, setLowestPrices] = useState<{ [id: string]: string }>(
    {}
  );
  const [renderedTemplates, setRenderedTemplates] = useState<Template[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    (async () => {
      if (collectionType) {
        try {
          const lowestPricesResult = await getLowestPricesForAllCollectionTemplates(
            { type: collectionType }
          );
          setLowestPrices(lowestPricesResult);

          const result = await getTemplatesByCollection({
            type: collectionType,
          });
          const templatesWithLowestPrice = formatTemplatesWithPriceData(
            result,
            lowestPricesResult
          );
          setRenderedTemplates(templatesWithLowestPrice);

          setIsLoading(false);
        } catch (e) {
          setErrorMessage(e.message);
        }
      }
    })();
  }, [collectionType]);

  return (
    <PageLayout title="Search Results">
      <Title>Search Results: {renderedTemplates.length}</Title>
    </PageLayout>
  );
};

export default Search;
