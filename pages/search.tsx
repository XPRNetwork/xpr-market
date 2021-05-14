import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PageLayout from '../components/PageLayout';
import Grid from '../components/Grid';
import PaginationButton from '../components/PaginationButton';
import ErrorComponent from '../components/Error';
import { Title, PurpleSpan } from '../styles/Title.styled';
import { useAuthContext } from '../components/Provider';
import { PAGINATION_LIMIT, CARD_RENDER_TYPES } from '../utils/constants';

const Search = (): JSX.Element => {
  const router = useRouter();
  const { isLoadingUser } = useAuthContext();
  const searchTerm = router.query.keywords
    ? (router.query.keywords as string).toLowerCase()
    : '';

  const getContent = () => {
    if (errorMessage) {
      return (
        <ErrorComponent
          errorMessage={errorMessage}
          buttonText="Try again"
          buttonOnClick={() => router.reload()}
        />
      );
    }

    const title = searchTerm ? (
      <>
        Search results for “<PurpleSpan>{searchTerm}</PurpleSpan>”
      </>
    ) : (
      'No results found'
    );

    return (
      <>
        <Title>{title}</Title>
        <TabSectionSearchTemplates />
      </>
    );
  };

  return <PageLayout title="Search Results">{getContent()}</PageLayout>;
};

export default Search;
