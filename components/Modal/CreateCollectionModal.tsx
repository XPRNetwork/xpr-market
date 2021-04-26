import { FormEventHandler, MouseEvent, useState, useRef } from 'react';
import { useAuthContext, useModalContext } from '../Provider';
import { CreateCollectionProps } from '../Provider/ModalProvider';
import DragDropFileUploadSm from '../DragDropFileUploadSm';
import InputField from '../InputField';
import Spinner from '../Spinner';
import {
  Background,
  ModalBox,
  Section,
  CloseIconContainer,
  Title,
  Form,
  Row,
  Column,
  HalfButton,
  DragDropButton,
  Description,
  ErrorMessage,
} from './Modal.styled';
import { useWindowSize } from '../../hooks';
import uploadToIPFS from '../../services/upload';
import { ReactComponent as CloseIcon } from '../../public/close.svg';
import { sendToApi } from '../../utils/browser-fetch';
import { fileReader } from '../../utils';

export const CreateCollectionModal = (): JSX.Element => {
  const { currentUser } = useAuthContext();
  const { isMobile } = useWindowSize();
  const { closeModal, modalProps } = useModalContext();
  const uploadInputRef = useRef<HTMLInputElement>();
  const {
    setNewCollection,
    setSelectedCollection,
    setIsUncreatedCollectionSelected,
  } = modalProps as CreateCollectionProps;
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');
  const [royalties, setRoyalties] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const author = currentUser ? currentUser.actor : '';

  const create: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setFormError('');

    const errors = [];

    if (!uploadedFile || uploadError) {
      errors.push('upload a PNG, GIF, JPG, or WEBP image (max 5 MB)');
    }

    if (!displayName) {
      errors.push('set a display name');
    }

    if (!description) {
      errors.push('set a description');
    }

    if (!royalties) {
      errors.push('set royalties');
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

    setIsLoading(true);
    try {
      const ipfsImage = await uploadToIPFS(uploadedFile);
      await sendToApi('POST', '/api/collections', {
        name,
        displayName,
        img: ipfsImage,
      });

      setNewCollection({
        collection_name: name,
        name: displayName,
        img: ipfsImage,
        description: description,
        royalties,
      });

      fileReader((img) => {
        setSelectedCollection({
          collection_name: name,
          name: displayName,
          img,
        });
      }, uploadedFile);

      setIsUncreatedCollectionSelected(true);
      closeModal();
    } catch (err) {
      setFormError('Unable to upload the collection image. Please try again.');
    }
    setIsLoading(false);
  };

  const handleBackgroundClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const openUploadWindow = () => {
    if (uploadInputRef && uploadInputRef.current) {
      uploadInputRef.current.click();
    }
  };

  return (
    <Background onClick={handleBackgroundClick}>
      <ModalBox>
        <Section>
          <Title>New collection</Title>
          <CloseIconContainer role="button" onClick={closeModal}>
            <CloseIcon />
          </CloseIconContainer>
        </Section>
        <Row>
          <DragDropFileUploadSm
            uploadInputRef={uploadInputRef}
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            setUploadError={setUploadError}
            setFormError={setFormError}
          />
          <Column>
            <Description mb="8px">
              We recommend an image of at least 400x400. Gifs work too.
            </Description>
            <DragDropButton onClick={openUploadWindow}>
              Choose file
            </DragDropButton>
            <ErrorMessage>{uploadError}</ErrorMessage>
          </Column>
        </Row>
        <Form onSubmit={isLoading ? null : create}>
          <InputField
            placeholder="Display Name"
            value={displayName}
            setFormError={setFormError}
            setValue={setDisplayName}
            mb="16px"
          />
          <InputField
            placeholder="Collection Name"
            value={name}
            setValue={setName}
            setFormError={setFormError}
            checkIfIsValid={(input: string) => {
              const hasValidCharacters = !!input.match(/^[a-z1-5]+$/);
              const isValidLength = input.length === 12;
              const isValid =
                (hasValidCharacters && isValidLength) ||
                input.toLowerCase() === author.toLowerCase();
              const errorMessage = `Collection name should be your account name (${author}) or a 12-character long name that only contains the numbers 1-5 or lowercase letters a-z`;
              return {
                isValid,
                errorMessage,
              };
            }}
            mb="16px"
          />
          <InputField
            placeholder="Description"
            value={description}
            setFormError={setFormError}
            setValue={setDescription}
          />
          <InputField
            mt="16px"
            mb="24px"
            inputType="number"
            min={0}
            max={15}
            step={1}
            value={royalties}
            setValue={setRoyalties}
            placeholder="Royalties"
            tooltip="A percentage of gross revenues derived from the use of an asset sold"
            numberOfTooltipLines={3}
            checkIfIsValid={(input) => {
              const numberInput = parseFloat(input as string);
              const isValid =
                !isNaN(numberInput) && numberInput >= 0 && numberInput <= 15;
              const errorMessage = 'Royalties must be between 0% and 15%';
              return {
                isValid,
                errorMessage,
              };
            }}
          />
          <ErrorMessage>{formError}</ErrorMessage>
          <HalfButton
            fullWidth={isMobile}
            type="submit"
            disabled={formError.length > 0 || isLoading}
            padding={isLoading ? '0 58px' : '11px 16px 13px'}>
            {isLoading ? (
              <Spinner size="42px" radius="10" hasBackground />
            ) : (
              'Create Collection'
            )}
          </HalfButton>
        </Form>
      </ModalBox>
    </Background>
  );
};
