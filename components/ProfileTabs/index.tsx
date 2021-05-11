import { Dispatch, SetStateAction } from 'react';
import { Tab } from './ProfileTabs.styled';
import { Row } from '../../styles/index.styled';

type Tab = {
  title: string;
  type: string;
};

type Props = {
  tabList: Tab[];
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
};

export const ProfileTabs = ({
  tabList,
  activeTab,
  setActiveTab,
}: Props): JSX.Element => {
  return (
    <Row justifyContent="flex-start" margin="0 0 40px 0">
      {tabList.map(({ title, type }) => {
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

export default ProfileTabs;
