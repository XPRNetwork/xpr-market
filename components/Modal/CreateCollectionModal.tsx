import { FormEventHandler, MouseEvent, useState, useRef } from 'react';
import { useAuthContext, useModalContext } from '../Provider';
import { CreateCollectionProps } from '../Provider/ModalProvider';
import DragDropFileUploadSm from '../DragDropFileUploadSm';
import InputField from '../InputField';
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
import ProtonSDK from '../../services/proton';
import uploadToIPFS from '../../services/upload';
import { ReactComponent as CloseIcon } from '../../public/close.svg';
import { fileReader } from '../../utils';

export const CreateCollectionModal = (): JSX.Element => {
  const { currentUser } = useAuthContext();
  const { closeModal, modalProps } = useModalContext();
  const uploadInputRef = useRef<HTMLInputElement>();
  const {
    fetchPageData,
    setCollectionImage,
    setCollectionName,
  } = modalProps as CreateCollectionProps;
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>();
  const author = currentUser ? currentUser.actor : '';

  const createCollection: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setFormError('');

    const errors = [];

    if (!uploadedFile || uploadError) {
      errors.push('upload an image');
    }

    if (!displayName) {
      errors.push('set a display name');
    }

    if (!description) {
      errors.push('set a description');
    }

    if (errors.length === 1) {
      setFormError(`Please ${errors[0]}.`);
      return;
    }

    if (errors.length === 2) {
      setFormError(`Please ${errors[0]} and ${errors[1]}.`);
      return;
    }

    if (errors.length > 1) {
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

    const ipfsImage = await uploadToIPFS(uploadedFile);

    const result = await ProtonSDK.createCollectionAndSchema({
      author,
      collection_name: name,
      description: description,
      display_name: displayName,
      collection_image: ipfsImage,
    });

    if (!result.success) {
      throw new Error((result.error as unknown) as string);
    }

    await fetchPageData();
    readImageAsString();
    setCollectionName(name);
    closeModal();

    // TODO: Remove console log after implementing collection fetch in Create page
    console.log('result createCollection: ', result);
  };

  const readImageAsString = () => {
    fileReader((result) => setCollectionImage(result), uploadedFile);
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
        <Form onSubmit={createCollection}>
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
              const errorMessage = `Collection name should be your account name (${author}) or a name that is 12 characters long and only contains the following symbols: 12345abcdefghijklmnopqrstuvwxyz`;
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
            mb="18px"
          />
          <ErrorMessage>{formError}</ErrorMessage>
          <HalfButton type="submit" disabled={formError.length > 0}>
            Create Collection
          </HalfButton>
        </Form>
      </ModalBox>
    </Background>
  );
};
