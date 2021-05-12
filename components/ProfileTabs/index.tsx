import { memo, Dispatch, SetStateAction } from 'react';
import { Tab } from './ProfileTabs.styled';
import { Row } from '../../styles/index.styled';

export type Tab = {
  title: string;
  type: string;
};

export interface ProfileTabsProps {
  tabs: Tab[];
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

export const ProfileTabs = ({
  tabs,
  activeTab,
  setActiveTab,
}: ProfileTabsProps): JSX.Element => {
  return (
    <Row justifyContent="flex-start" margin="0 0 40px 0">
      {tabs.map(({ title, type }) => {
        return (
          <Tab
            key={type}
            onClick={() => setActiveTab(type)}
            isActive={activeTab === type}>
            {title}
          </Tab>
        );
      })}
    </Row>
  );
};

export default memo(ProfileTabs);
