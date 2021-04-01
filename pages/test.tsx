import { useState } from 'react';
import PageLayout from '../components/PageLayout';
import { Title } from '../styles/Title.styled';
import proton from '../services/proton';
import { useAuthContext } from '../components/Provider';

const TestPage = (): JSX.Element => {
  const { currentUser } = useAuthContext();
  const [recipient, setRecipient] = useState('');
  const [assetIdTransfer, setAssetIdTransfer] = useState('');
  const [assetIdBurn, setAssetIdBurn] = useState('');

  const [memo, setMemo] = useState('');

  const transfer = async () => {
    const { actor } = currentUser;
    const result = await proton.transfer({
      sender: actor,
      recipient: recipient,
      asset_id: assetIdTransfer,
      memo: memo,
    });
    console.log('result: ', result);
  };

  const burn = async () => {
    const { actor } = currentUser;
    const result = await proton.burn({
      owner: actor,
      asset_id: assetIdBurn,
    });
    console.log('result burn: ', result);
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
        value={assetIdTransfer}
        placeholder="assetId"
        onChange={(e) => setAssetIdTransfer(e.target.value)}
      />
      <input
        value={memo}
        placeholder="memo"
        onChange={(e) => setMemo(e.target.value)}
      />
      <button onClick={transfer}>transfer</button>
      <br />
      <input
        value={assetIdBurn}
        placeholder="assetId"
        onChange={(e) => setAssetIdBurn(e.target.value)}
      />
      <button onClick={burn}>burn</button>
    </PageLayout>
  );
};

export default TestPage;
