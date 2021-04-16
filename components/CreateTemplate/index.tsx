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

type Props = {
  goToMint: () => void;
  setTemplateUploadedFile: Dispatch<SetStateAction<File>>;
  templateUploadedFile: File;
  templateName: string;
  setTemplateName: Dispatch<SetStateAction<string>>;
  templateDescription: string;
  setTemplateDescription: Dispatch<SetStateAction<string>>;
  editionSize: string;
  setEditionSize: Dispatch<SetStateAction<string>>;
};

const CreateTemplate = ({
  goToMint,
  setTemplateUploadedFile,
  templateUploadedFile,
  templateName,
  setTemplateName,
  templateDescription,
  setTemplateDescription,
  editionSize,
  setEditionSize,
}: Props): JSX.Element => {
  const [formError, setFormError] = useState<string>('');

  const validateAndProceed = () => {
    if (
      !templateName ||
      !templateUploadedFile ||
      !templateDescription ||
      !editionSize
    ) {
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

      if (typeof editionSize === 'undefined' || isNaN(parseInt(editionSize))) {
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
    } else {
      setFormError('');
      goToMint();
    }
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
        value={editionSize}
        setValue={setEditionSize}
        placeholder="Edition Size"
        tooltip="The number of tokens created"
        numberOfTooltipLines={1}
      />
      {formError ? <ErrorMessage>{formError}</ErrorMessage> : null}
      <Button onClick={validateAndProceed}>Continue</Button>
    </>
  );
};

export default CreateTemplate;
