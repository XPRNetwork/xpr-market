import { memo } from 'react';
export { TabSectionUserProfileItems } from './TabSectionUserProfileItems';
export { TabSectionUserProfileCreations } from './TabSectionUserProfileCreations';
import Tabs from '../Tabs';
import FilterDropdown, { FilterDropdownProps } from '../FilterDropdown';
import PaginationButton from '../PaginationButton';
import Grid from '../Grid';
import EmptyUserContent from '../EmptyUserContent';
import { TabsProps } from '../Tabs';
import { Row } from './TabSection.styled';
import { Template } from '../../services/templates';
import { SearchTemplate } from '../../services/search';
import { PAGINATION_LIMIT, FILTER_TYPES } from '../../utils/constants';

export interface SectionContainerProps extends TabsProps {
  chainAccount?: string;
}

export interface SectionContentByFilter {
  [filterType: string]: Template[];
}

export const defaultSectionContentByFilter = {
  [FILTER_TYPES.NAME]: [],
  [FILTER_TYPES.RECENTLY_CREATED]: [],
};

type Props = {
  showNextPage: () => Promise<void>;
  isLoadingPrices: boolean;
  isFetching: boolean;
  rendered: Template[] | SearchTemplate[];
  nextPageNumber: number;
  tabsProps: TabsProps;
  filterDropdownProps: FilterDropdownProps;
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
  tabsProps,
  filterDropdownProps,
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
      <Row>
        <Tabs {...tabsProps} />
        <FilterDropdown {...filterDropdownProps} />
      </Row>
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
