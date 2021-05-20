import PageLayout from '../components/PageLayout';
import { useBlacklistContext } from '../components/Provider';

const Test = (): JSX.Element => {
  const blacklist = useBlacklistContext();

  const getBlacklist = async () => {
    console.log('blacklist: ', blacklist);
  };

  return (
    <PageLayout title="Test">
      <p>Test Page</p>
      <button onClick={getBlacklist}>console blacklist</button>
    </PageLayout>
  );
};

export default Test;
