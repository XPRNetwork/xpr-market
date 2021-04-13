import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import PageLayout from '../components/PageLayout';
import Button from '../components/Button';
import TemplateCard from '../components/TemplateCard';
import InputField from '../components/InputField';
import DragDropFileUploadLg from '../components/DragDropFileUploadLg';
import MobileCreatePagePlaceholder from '../components/MobileCreatePagePlaceholder';
import {
  useAuthContext,
  useModalContext,
  MODAL_TYPES,
} from '../components/Provider';
import {
  Container,
  Row,
  LeftColumn,
  RightColumn,
  Title,
  SubTitle,
  ElementTitle,
  EmptyBox2,
  Terms,
  TermsLink,
  BoxButton,
} from '../styles/CreatePage';
import { useNavigatorUserAgent } from '../hooks';
import { fileReader } from '../utils';

const Create = (): JSX.Element => {
  const router = useRouter();
  const { currentUser, isLoadingUser } = useAuthContext();
  const { openModal, setModalProps } = useModalContext();
  const { isDesktop } = useNavigatorUserAgent();
  const [collectionName, setCollectionName] = useState<string>('');
  const [collectionImage, setCollectionImage] = useState<string>('');
  const [templateName, setTemplateName] = useState<string>('');
  const [templateImage, setTemplateImage] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [royalties, setRoyalties] = useState<string>('');
  const [editionSize, setEditionSize] = useState<string>('');
  const [mintAmount, setMintAmount] = useState<string>('');
  const [templateUploadedFile, setTemplateUploadedFile] = useState<File | null>(
    null
  );
  const [isAudio, setIsAudio] = useState<boolean>(false);
  const [isVideo, setIsVideo] = useState<boolean>(false);

  useEffect(() => {
    if (templateUploadedFile && window) {
      const filetype = templateUploadedFile.type;
      if (filetype.includes('audio')) {
        setIsAudio(true);
        setIsVideo(false);
      } else if (filetype.includes('video')) {
        setIsVideo(true);
        setIsAudio(false);
      } else {
        const readerSetTemplateImage = (result) => {
          setTemplateImage(result);
          setIsAudio(false);
          setIsVideo(false);
        };
        fileReader(readerSetTemplateImage, templateUploadedFile);
      }
    }
  }, [templateUploadedFile]);

  useEffect(() => {
    if (!currentUser && !isLoadingUser) {
      router.push('/');
    }
  }, [currentUser, isLoadingUser]);

  const getUserCollections = async () => {
    console.log('refetch user collections');
  };

  const createCollection = () => {
    openModal(MODAL_TYPES.CREATE_COLLECTION);
    setModalProps({
      fetchPageData: getUserCollections,
      setCollectionImage: setCollectionImage,
      setCollectionName: setCollectionName,
    });
  };

  const getContent = () => {
    if (!currentUser) {
      return null;
    }

    if (!isDesktop) {
      return <MobileCreatePagePlaceholder />;
    }

    return (
      <Container>
        <Row>
          <LeftColumn>
            <Title>Create new NFT</Title>
            <SubTitle>
              Every new account can create up to 10 NFTs for free. After that a
              small fee per NFT is charged reflecting network costs.
            </SubTitle>
            <ElementTitle>Upload file</ElementTitle>
            <DragDropFileUploadLg
              setTemplateUploadedFile={setTemplateUploadedFile}
              templateUploadedFile={templateUploadedFile}
            />
            <ElementTitle>Choose Collection</ElementTitle>
            <Row>
              <BoxButton onClick={createCollection}>
                <Image
                  priority
                  layout="fixed"
                  width={40}
                  height={40}
                  alt="plus icon"
                  src="/plus-icon.png"
                />
                <span>Create</span>
              </BoxButton>
              <EmptyBox2 />
            </Row>
            <InputField
              mt="16px"
              value={templateName}
              setValue={setTemplateName}
              placeholder="Name"
            />
            <InputField
              mt="16px"
              value={description}
              setValue={setDescription}
              placeholder="Description"
            />
            <Row>
              <InputField
                mt="16px"
                mr="4px"
                value={royalties}
                setValue={setRoyalties}
                placeholder="Royalties"
                tooltip="A percentage of gross revenues derived from the use of an asset sold"
                numberOfTooltipLines={3}
              />
              <InputField
                mt="16px"
                ml="4px"
                value={editionSize}
                setValue={setEditionSize}
                placeholder="Edition Size"
                tooltip="The number of tokens created"
                numberOfTooltipLines={1}
              />
            </Row>
            <ElementTitle>Initial Mint</ElementTitle>
            <InputField
              value={mintAmount}
              setValue={setMintAmount}
              placeholder="Mint Amount"
            />
            <Terms>By clicking “Create NFT” you agree to our</Terms>
            <TermsLink target="_blank" href="https://www.protonchain.com/terms">
              Terms of Service &amp; Privacy Policy
            </TermsLink>
            <Button onClick={null}>Create NFT</Button>
          </LeftColumn>
          <RightColumn>
            <ElementTitle>Preview</ElementTitle>
            <TemplateCard
              templateImage={templateImage}
              templateName={templateName}
              collectionImage={collectionImage}
              collectionName={collectionName}
              editionSize={editionSize}
              noHoverEffect={true}
              noIpfsConversion={true}
              isAudio={isAudio}
              isVideo={isVideo}
              isStatic={true}
            />
          </RightColumn>
        </Row>
      </Container>
    );
  };

  return <PageLayout title="Create">{getContent()}</PageLayout>;
};

export default Create;
