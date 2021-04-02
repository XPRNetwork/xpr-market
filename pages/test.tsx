import { useState } from 'react';
import PageLayout from '../components/PageLayout';
import { useAuthContext } from '../components/Provider';
import proton from '../services/proton';
import { getUserCreatedTemplates } from '../services/templates';
import { Title } from '../styles/Title.styled';
import TextInput from '../components/TextInput';

const TestPage = (): JSX.Element => {
  const { currentUser } = useAuthContext();
  const [recipient, setRecipient] = useState('');
  const [assetIdTransfer, setAssetIdTransfer] = useState('');
  const [assetIdBurn, setAssetIdBurn] = useState('');
  const [ownCreationUser, setOwnCreationUser] = useState('monsters');
  const [memo, setMemo] = useState('');
  const [text1, setText1] = useState<string>('');
  const [text2, setText2] = useState<string>('');
  const [text3, setText3] = useState<string>('');

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

  const getOwnCreations = async () => {
    const result = await getUserCreatedTemplates(ownCreationUser);
    console.log('result for your own creations: ', result);
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
      <br />
      <div style={{ display: 'flex' }}>
        <TextInput
          text={text1}
          setText={setText1}
          tooltip="Test one-liner tooltip"
          numberOfTooltipLines={1}
          placeholder="Test input"
          mr="4px"
          checkIfIsValid={(input) => {
            const isValid = input.length === 0;
            const errorMessage = 'Error: this is a test error message.';
            return {
              isValid,
              errorMessage,
            };
          }}
        />
        <TextInput
          text={text2}
          setText={setText2}
          tooltip="Test two-liner tooltip: test test test test test"
          numberOfTooltipLines={2}
          placeholder="Test input"
          ml="4px"
          checkIfIsValid={(input) => {
            const isValid = input.length === 0;
            const errorMessage = 'Error: this is a test error message.';
            return {
              isValid,
              errorMessage,
            };
          }}
        />
      </div>
      <br />
      <TextInput
        text={text3}
        setText={setText3}
        tooltip="Test three-liner tooltip: test test test test test test test test test test test test test"
        numberOfTooltipLines={3}
        placeholder="Test input"
        checkIfIsValid={(input) => {
          const isValid = input.length === 0;
          const errorMessage = 'Error: this is a test error message.';
          return {
            isValid,
            errorMessage,
          };
        }}
      />
      <br />
      <input
        value={ownCreationUser}
        placeholder="account name"
        onChange={(e) => setOwnCreationUser(e.target.value)}
      />
      <button onClick={getOwnCreations}>See own creations (console log)</button>
    </PageLayout>
  );
};

export default TestPage;
