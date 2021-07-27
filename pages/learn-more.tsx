/* eslint-disable jsx-a11y/media-has-caption */
import { FC } from 'react';
import PageLayout from '../components/PageLayout';
import LearnMoreCard from '../components/LearnMoreCard';

const LearnMore: FC = () => {
  const getContent = () => {
    return (
      <PageLayout title="Learn More">
        <LearnMoreCard />
      </PageLayout>
    );
  };

  return getContent();
};

export default LearnMore;
