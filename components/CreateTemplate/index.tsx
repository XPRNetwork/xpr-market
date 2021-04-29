import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import {
  Title,
  SubTitle,
  Step,
  ElementTitle,
  ErrorMessage,
  Terms,
  TermsLink,
  FeeLabel,
} from '../CreatePageLayout/CreatePageLayout.styled';
import DragDropFileUploadLg from '../DragDropFileUploadLg';
import InputField from '../InputField';
import Button from '../Button';
import Spinner from '../Spinner';
import { BackButton } from '../CreatePageLayout/CreatePageLayout.styled';
import { CREATE_PAGE_STATES } from '../../pages/create';
import { LG_FILE_UPLOAD_TYPES_TEXT } from '../../utils/constants';
import { calculateFee } from '../../utils';
import {
  RAM_AMOUNTS,
  SHORTENED_TOKEN_PRECISION,
  PRICE_OF_RAM_IN_XPR,
} from '../../utils/constants';

type Props = {
  goToMint: () => void;
  setTemplateUploadedFile: Dispatch<SetStateAction<File>>;
  templateUploadedFile: File;
  templateName: string;
  setTemplateName: Dispatch<SetStateAction<string>>;
  templateDescription: string;
  setTemplateDescription: Dispatch<SetStateAction<string>>;
  maxSupply: string;
  setMaxSupply: Dispatch<SetStateAction<string>>;
  setPageState: Dispatch<SetStateAction<string>>;
  mintAmount: string;
  setMintAmount: Dispatch<SetStateAction<string>>;
  createNft: () => Promise<void>;
  createNftError: string;
  accountRam: number;
  contractRam: number;
  conversionRate: number;
};

const CreateTemplate = ({
  goToMint,
  setTemplateUploadedFile,
  templateUploadedFile,
  templateName,
  setTemplateName,
  templateDescription,
  setTemplateDescription,
  setMaxSupply,
  createNft,
  setMintAmount,
  mintAmount,
  createNftError,
  setPageState,
  maxSupply,
  accountRam,
  contractRam,
  conversionRate,
}: Props): JSX.Element => {
  const [formError, setFormError] = useState<string>('');
  const [mintError, setMintError] = useState<string>('');
  const [mintFee, setMintFee] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(false);

  const validateAndProceed = async () => {
    const errors = [];
    if (!templateUploadedFile) {
      errors.push(`upload a ${LG_FILE_UPLOAD_TYPES_TEXT}`);
    }
    if (!templateName) {
      errors.push('set a name');
    }

    if (!templateDescription) {
      errors.push('set a description');
    }

    if (typeof maxSupply === 'undefined' || isNaN(parseInt(maxSupply))) {
      errors.push(
        "set the template's maximum edition size (0 for no maximum edition size)"
      );
    }

    if (errors.length === 1) {
      setFormError(`Please ${errors[0]}.`);
      return;
    }

    if (errors.length === 2) {
      setFormError(`Please ${errors[0]} and ${errors[1]}.`);
      return;
    }

    if (errors.length > 2) {
      const lastErrorIndex = errors.length - 1;
      let errorMessage = `Please ${errors[0]}`;

      for (let i = 1; i < errors.length; i++) {
        if (i === lastErrorIndex) {
          errorMessage += `, and ${errors[i]}.`;
          break;
        }
        errorMessage += `, ${errors[i]}`;
      }

      setFormError(errorMessage);
      return;
    }

    if (!mintAmount) {
      setMintError('Please fill in an initial mint amount (minimum 1).');
    } else {
      setFormError('');
      setMintError('');
      setIsLoading(true);
      try {
        await createNft();
      } catch (e) {
        setMintError(e);
      }
      setIsLoading(false);
    }
  };

  const checkMintAmountValidity = (amount) => {
    const number = parseInt(amount);
    let valid = false;
    let errorMessage;

    if (number >= 1 && number <= 50) {
      if (parseInt(maxSupply) > 0) {
        if (number <= parseInt(maxSupply)) {
          valid = true;
        } else {
          errorMessage = 'You cannot mint more than the set edition size';
        }
      } else {
        valid = true;
      }
    } else {
      errorMessage = 'You can mint 1-50 assets at a time';
    }

    setIsValid(valid);
    return {
      isValid: valid,
      errorMessage,
    };
  };

  useEffect(() => {
    return () => {
      setMintAmount('');
      setMintFee(0);
    };
  }, []);

  useEffect(() => {
    if (createNftError) {
      setMintError(createNftError);
    } else {
      setMintError('');
    }
  }, [createNftError]);

  useEffect(() => {
    const numAssets = parseInt(mintAmount);
    const currentRamAmount =
      contractRam === -1
        ? RAM_AMOUNTS.FREE_INITIAL_SPECIAL_MINT_CONTRACT_RAM
        : contractRam;
    const mintFee = calculateFee({
      numAssets: isNaN(numAssets) ? 0 : numAssets,
      currentRamAmount,
      ramCost: RAM_AMOUNTS.MINT_ASSET,
      conversionRate,
    });
    const accountRamCosts =
      (RAM_AMOUNTS.CREATE_COLLECTION_SCHEMA_TEMPLATE - accountRam) *
      PRICE_OF_RAM_IN_XPR *
      conversionRate;
    const ramFee = accountRamCosts > 0 ? accountRamCosts : 0;
    const fee = mintFee + ramFee;
    setMintFee(isNaN(fee) ? 0 : fee);
  }, [mintAmount, isLoading]);

  return (
    <>
      <Step>Step 2 of 2</Step>
      <Title>Create a NFT</Title>
      <SubTitle>
        Each NFT edition follows a specific &quot;template&quot; which
        identifies the fields of the NFT. This is also saved on the chain
        itself.
      </SubTitle>
      <ElementTitle>Upload file</ElementTitle>
      <DragDropFileUploadLg
        setTemplateUploadedFile={setTemplateUploadedFile}
        templateUploadedFile={templateUploadedFile}
      />
      <InputField
        mt="16px"
        value={templateName}
        setValue={setTemplateName}
        placeholder="Name"
      />
      <InputField
        mt="16px"
        value={templateDescription}
        setValue={setTemplateDescription}
        placeholder="Description"
      />
      <InputField
        mt="16px"
        mb="30px"
        inputType="number"
        min={0}
        step={1}
        value={maxSupply}
        setValue={setMaxSupply}
        placeholder="Edition Size"
        tooltip="Maximum number of NFTs in this edition. Put 0 for an unlimited edition size."
        checkIfIsValid={(input) => {
          const numberInput = parseFloat(input as string);
          const isValid = !isNaN(numberInput) && numberInput >= 0;
          const errorMessage = 'Edition size must be 0 or greater.';
          return {
            isValid,
            errorMessage,
          };
        }}
        numberOfTooltipLines={3}
      />
      {formError ? <ErrorMessage>{formError}</ErrorMessage> : null}

      <Title>Initial Mint</Title>
      <SubTitle>
        Now you are ready to mint your NFT. Choose an initial mint amount (first
        10 are for free). Minting takes a bit of time, so we recommend no more
        than 50 tokens in your initial mint.
      </SubTitle>
      <InputField
        inputType="number"
        min={1}
        max={50}
        step={1}
        mt="8px"
        value={mintAmount}
        setValue={setMintAmount}
        placeholder="Enter mint amount"
        submit={isValid ? null : createNft}
        checkIfIsValid={checkMintAmountValidity}
      />
      <FeeLabel>
        <span>Mint Fee</span>
        <span>{mintFee.toFixed(SHORTENED_TOKEN_PRECISION)} XUSDC</span>
      </FeeLabel>
      <Terms>By clicking “Create NFT” you agree to our</Terms>
      <TermsLink target="_blank" href="https://www.protonchain.com/terms">
        Terms of Service &amp; Privacy Policy
      </TermsLink>
      {mintError ? <ErrorMessage>{mintError}</ErrorMessage> : null}
      <Button
        onClick={isLoading ? null : validateAndProceed}
        disabled={!isValid || isLoading}
        padding={isLoading ? '0' : '12px 0'}>
        {isLoading ? (
          <Spinner size="42px" radius="10" hasBackground />
        ) : (
          'Create NFT'
        )}
      </Button>
      <BackButton
        onClick={() => setPageState(CREATE_PAGE_STATES.CHOOSE_COLLECTION)}>
        Back
      </BackButton>
    </>
  );
};

export default CreateTemplate;
