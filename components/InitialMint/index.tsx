import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  Title,
  SubTitle,
  Step,
  Terms,
  TermsLink,
  ErrorMessage,
} from '../CreatePageLayout/CreatePageLayout.styled';
import InputField from '../InputField';
import Button from '../Button';

type Props = {
  mintAmount: string;
  setMintAmount: Dispatch<SetStateAction<string>>;
  createNft: () => Promise<void>;
  createNftError: string;
};

const InitialMint = ({
  createNft,
  setMintAmount,
  mintAmount,
  createNftError,
}: Props): JSX.Element => {
  const [mintError, setMintError] = useState<string>('');

  useEffect(() => {
    if (createNftError) {
      setMintError(createNftError);
    } else {
      setMintError('');
    }
  }, [createNftError]);

  const validateAndProceed = async () => {
    if (!mintAmount) {
      setMintError('Please fill in an initial mint amount (minimum 1).');
    } else {
      setMintError('');
      try {
        await createNft();
      } catch (e) {
        setMintError(e);
      }
    }
  };

  return (
    <>
      <Step>Step 3 of 3</Step>
      <Title>Initial Mint</Title>
      <SubTitle>
        Now you are ready to mint your NFT. Choose an initial mint amount (first
        10 are for free). Minting takes a bit of time, so we recommend no more
        than 50 tokens in your initial mint.
      </SubTitle>
      <InputField
        inputType="number"
        min={1}
        step={1}
        value={mintAmount}
        setValue={setMintAmount}
        placeholder="Mint Amount"
        submit={createNft}
        checkIfIsValid={(input) => {
          const numberInput = parseFloat(input as string);
          const isValid = !isNaN(numberInput) && numberInput >= 1;
          const errorMessage = 'Initial mint must be at least 1';
          return {
            isValid,
            errorMessage,
          };
        }}
      />
      <Terms>By clicking “Create NFT” you agree to our</Terms>
      <TermsLink target="_blank" href="https://www.protonchain.com/terms">
        Terms of Service &amp; Privacy Policy
      </TermsLink>
      {mintError ? <ErrorMessage>{mintError}</ErrorMessage> : null}
      <Button onClick={validateAndProceed}>Create NFT</Button>
    </>
  );
};

export default InitialMint;
