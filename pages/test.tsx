/* eslint-disable jsx-a11y/media-has-caption */
import { useState } from 'react';
import PageLayout from '../components/PageLayout';
import { useAuthContext } from '../components/Provider';
import proton from '../services/proton';
import { getUserCreatedTemplates } from '../services/templates';
import { Title } from '../styles/Title.styled';
import InputField from '../components/InputField';

const TestPage = (): JSX.Element => {
  const { currentUser } = useAuthContext();
  const [recipient, setRecipient] = useState('');
  const [assetIdTransfer, setAssetIdTransfer] = useState('');
  const [ownCreationUser, setOwnCreationUser] = useState('monsters');
  const [memo, setMemo] = useState('');
  const [text1, setText1] = useState<string>('');
  const [text2, setText2] = useState<string>('');
  const [collectionName, setCollectionName] = useState<string>('');
  const [fee, setFee] = useState<number>();

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

  const setMarketFee = async () => {
    const market_fee =
      typeof fee === 'string'
        ? (parseFloat(fee) / 100).toFixed(6)
        : (fee / 100).toFixed(6);
    const { actor } = currentUser;
    const result = await proton.setMarketFee({
      author: actor,
      collection_name: collectionName,
      market_fee,
    });
    console.log('result setMarketFee: ', result);
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
        value={collectionName}
        placeholder="Collection Name"
        onChange={(e) => setCollectionName(e.target.value)}
      />
      <InputField
        placeholder="Market Fee"
        inputType="number"
        min={0}
        max={15}
        step={1}
        value={fee}
        setValue={setFee}
        checkIfIsValid={(input) => {
          const isValid = input >= 0 && input <= 15;
          const errorMessage = 'Market fee must be between 0% and 15%';
          return {
            isValid,
            errorMessage,
          };
        }}
      />
      <button onClick={setMarketFee}>setMarketFee</button>
      <br />
      <div style={{ display: 'flex' }}>
        <InputField
          value={text1}
          setValue={setText1}
          tooltip="Test one-liner tooltip"
          numberOfTooltipLines={1}
          placeholder="Test input"
          mr="4px"
          checkIfIsValid={(input) => {
            const isValid = (input as string).length === 0;
            const errorMessage = 'Error: this is a test error message.';
            return {
              isValid,
              errorMessage,
            };
          }}
        />
        <InputField
          value={text2}
          setValue={setText2}
          tooltip="Test two-liner tooltip: test test test test test"
          numberOfTooltipLines={2}
          placeholder="Test input"
          ml="4px"
          checkIfIsValid={(input) => {
            const isValid = (input as string).length === 0;
            const errorMessage = 'Error: this is a test error message.';
            return {
              isValid,
              errorMessage,
            };
          }}
        />
      </div>
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
