import { memo } from 'react';
export { TabSectionUserProfileItems } from './TabSectionUserProfileItems';
export { TabSectionUserProfileCreations } from './TabSectionUserProfileCreations';
import PaginationButton from '../PaginationButton';
import Grid from '../Grid';
import EmptyUserContent from '../EmptyUserContent';
import { TabsProps } from '../Tabs';
import { Template } from '../../services/templates';
import { PAGINATION_LIMIT } from '../../utils/constants';
import { SearchTemplate } from '../../services/search';

export interface SectionContainerProps extends TabsProps {
  chainAccount?: string;
}

type Props = {
  showNextPage: () => Promise<void>;
  isLoadingPrices: boolean;
  isFetching: boolean;
  rendered: Template[] | SearchTemplate[];
  nextPageNumber: number;
  emptyContent: {
    subtitle: string;
    buttonTitle: string;
    link: string;
  };
  type: string;
};

const TabSection = ({
  showNextPage,
  isLoadingPrices,
  isFetching,
  rendered,
  nextPageNumber,
  type,
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

    return (
      <Grid type={type} isLoadingPrices={isLoadingPrices} items={rendered} />
    );
  };

  return (
    <>
      {getSectionContent()}
      <PaginationButton
        onClick={showNextPage}
        isLoading={isFetching}
        isHidden={isFetching || nextPageNumber === -1}
        disabled={isFetching || rendered.length < PAGINATION_LIMIT}
        autoLoad
      />
    </>
  );
};

TabSection.defaultProps = {
  showNextPage: () => {},
  isLoadingPrices: false,
  isFetching: true,
  rendered: [],
  nextPageNumber: -1,
  emptyContent: {
    subtitle: '',
    buttonTitle: '',
    link: '',
  },
};

export default memo(TabSection);
