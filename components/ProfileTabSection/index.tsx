export { ProfileTabSectionItems } from './ProfileTabSectionItems';
export { ProfileTabSectionCreations } from './ProfileTabSectionCreations';
import { memo } from 'react';
import PaginationButton from '../../components/PaginationButton';
import Grid from '../../components/Grid';
import EmptyUserContent from '../../components/EmptyUserContent';
import { Template } from '../../services/templates';
import { PAGINATION_LIMIT } from '../../utils/constants';

type Props = {
  showNextPage: () => Promise<void>;
  isLoadingPrices: boolean;
  isFetching: boolean;
  rendered: Template[];
  prefetchPageNumber: number;
  emptyContent: {
    subtitle: string;
    buttonTitle: string;
    link: string;
  };
};

const ProfileTabSection = ({
  showNextPage,
  isLoadingPrices,
  isFetching,
  rendered,
  prefetchPageNumber,
  emptyContent,
}: Props): JSX.Element => {
  const getSectionContent = () => {
    if (!rendered.length) {
      const { subtitle, buttonTitle, link } = emptyContent;
      return (
        <EmptyUserContent
          subtitle={subtitle}
          buttonTitle={buttonTitle}
          link={link}
        />
      );
    }

    return <Grid isLoadingPrices={isLoadingPrices} items={rendered} />;
  };

  return (
    <>
      {getSectionContent()}
      <PaginationButton
        onClick={showNextPage}
        isLoading={isFetching}
        isHidden={isFetching || prefetchPageNumber === -1}
        disabled={isFetching || rendered.length < PAGINATION_LIMIT}
        autoLoad
      />
    </>
  );
};

ProfileTabSection.defaultProps = {
  showNextPage: () => {},
  isLoadingPrices: false,
  isFetching: true,
  rendered: [],
  prefetchPageNumber: -1,
  emptyContent: {
    subtitle: '',
    buttonTitle: '',
    link: '',
  },
};

export default memo(ProfileTabSection);
