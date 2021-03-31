import { useState } from 'react';
import PageLayout from '../components/PageLayout';
import { Title } from '../styles/Title.styled';
import proton from '../services/proton';
import { useAuthContext } from '../components/Provider';

const TestPage = (): JSX.Element => {
  const { currentUser } = useAuthContext();
  const [recipient, setRecipient] = useState('');
  const [assetId, setAssetId] = useState('');
  const [memo, setMemo] = useState('');

  const transfer = async () => {
    const { actor } = currentUser;
    const result = await proton.transfer({
      sender: actor,
      recipient: recipient,
      asset_id: assetId,
      memo: memo,
    });
    console.log('result: ', result);
  };

  return (
    <PageLayout title="TestPage">
      <Title>Test Page</Title>
      <input
        value={recipient}
        placeholder="recipient"
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        value={assetId}
        placeholder="assetId"
        onChange={(e) => setAssetId(e.target.value)}
      />
      <input
        value={memo}
        placeholder="memo"
        onChange={(e) => setMemo(e.target.value)}
      />
      <button onClick={transfer}>transfer</button>
    </PageLayout>
  );
};

export default TestPage;
