import { Dispatch, SetStateAction, useState } from 'react';
import {
  Title,
  SubTitle,
  Step,
  ElementTitle,
  ErrorMessage,
} from '../CreatePageLayout/CreatePageLayout.styled';
import DragDropFileUploadLg from '../DragDropFileUploadLg';
import InputField from '../InputField';
import Button from '../Button';
import { BackButton } from '../CreatePageLayout/CreatePageLayout.styled';
import { CREATE_PAGE_STATES } from '../../pages/create';

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
};

const CreateTemplate = ({
  goToMint,
  setTemplateUploadedFile,
  templateUploadedFile,
  templateName,
  setTemplateName,
  templateDescription,
  setTemplateDescription,
  maxSupply,
  setMaxSupply,
  setPageState,
}: Props): JSX.Element => {
  const [formError, setFormError] = useState<string>('');

  const validateAndProceed = () => {
    const errors = [];
    if (!templateUploadedFile) {
      errors.push(
        'upload a PNG, GIF, JPG, or WEBP image or MP4 video (max 30 MB)'
      );
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

    setFormError('');
    goToMint();
  };

  return (
    <>
      <Step>Step 2 of 3</Step>
      <Title>Create a template</Title>
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
        tooltip="The number of tokens created"
        numberOfTooltipLines={1}
      />
      {formError ? <ErrorMessage>{formError}</ErrorMessage> : null}
      <Button onClick={validateAndProceed}>Continue</Button>
      <BackButton
        onClick={() => setPageState(CREATE_PAGE_STATES.CHOOSE_COLLECTION)}>
        Back
      </BackButton>
    </>
  );
};

export default CreateTemplate;
