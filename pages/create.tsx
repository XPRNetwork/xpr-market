/* eslint-disable jsx-a11y/media-has-caption */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PageLayout from '../components/PageLayout';
import Button from '../components/Button';
import TemplateCard from '../components/TemplateCard';
import InputField from '../components/InputField';
import DragDropFileUploadLg from '../components/DragDropFileUploadLg';
import MobileCreatePagePlaceholder from '../components/MobileCreatePagePlaceholder';
import { useAuthContext } from '../components/Provider';
import { Collection, getAuthorsCollections } from '../services/collections';
import CollectionsCarousel, {
  NewCollection,
  CarouselCollection,
} from '../components/CollectionsCarousel';
import {
  Container,
  Row,
  LeftColumn,
  RightColumn,
  Title,
  SubTitle,
  ElementTitle,
  Terms,
  TermsLink,
} from '../styles/CreatePage';
import ProtonSDK from '../services/proton';
import uploadToIPFS from '../services/upload';
import { useNavigatorUserAgent } from '../hooks';
import { fileReader } from '../utils';
import NftCreateSuccess from '../components/NftCreateSuccess';

const CREATE_PAGE_STATES = {
  CHOOSE_COLLECTION: 'CHOOSE_COLLECTION',
  CREATE_TEMPLATE: 'CREATE_TEMPLATE',
  MINT_ASSETS: 'MINT_ASSETS',
  SUCCESS: 'SUCCESS',
};

const placeholderCollection = {
  collection_name: '',
  name: '',
  img: '',
};

const Create = (): JSX.Element => {
  const router = useRouter();
  const { currentUser, isLoadingUser } = useAuthContext();
  const { isDesktop } = useNavigatorUserAgent();
  const [
    selectedCollection,
    setSelectedCollection,
  ] = useState<CarouselCollection>(placeholderCollection);
  const [newCollection, setNewCollection] = useState<NewCollection>();
  const [templateName, setTemplateName] = useState<string>('');
  const [templateDescription, setTemplateDescription] = useState<string>('');
  const [templateImage, setTemplateImage] = useState<string>('');
  const [templateVideo, setTemplateVideo] = useState<string>('');
  const [royalties, setRoyalties] = useState<string>();
  const [editionSize, setEditionSize] = useState<string>();
  const [mintAmount, setMintAmount] = useState<string>();
  const [templateUploadedFile, setTemplateUploadedFile] = useState<File | null>(
    null
  );
  const [collectionsList, setCollectionsList] = useState<Collection[]>([]);
  const [error, setError] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [
    isUncreatedCollectionSelected,
    setIsUncreatedCollectionSelected,
  ] = useState<boolean>(false);
  const [pageState, setPageState] = useState<string>(
    CREATE_PAGE_STATES.CHOOSE_COLLECTION
  );
  const [isLoadingCollections, setIsLoadingCollections] = useState<boolean>(
    true
  );

  useEffect(() => {
    if (templateUploadedFile && window) {
      const filetype = templateUploadedFile.type;
      if (filetype.includes('video')) {
        const readerSetTemplateVideo = (result) => {
          setTemplateVideo(result);
        };
        fileReader(readerSetTemplateVideo, templateUploadedFile);
      } else {
        const readerSetTemplateImage = (result) => {
          setTemplateImage(result);
        };
        fileReader(readerSetTemplateImage, templateUploadedFile);
      }
    } else {
      setTemplateImage('');
      setTemplateVideo('');
    }
  }, [templateUploadedFile]);

  useEffect(() => {
    if (!currentUser && !isLoadingUser) {
      router.push('/');
    }
    getUserCollections();
  }, [currentUser, isLoadingUser]);

  const getUserCollections = async () => {
    if (currentUser) {
      try {
        setIsLoadingCollections(true);
        const collections = await getAuthorsCollections(currentUser.actor);
        setCollectionsList(collections);
        setError('');
        setIsLoadingCollections(false);
      } catch (e) {
        setIsLoadingCollections(false);
        setError(e.message || e.error);
      }
    }
  };

  const createNft = async () => {
    setFormError('');

    const errors = []; // TODO: Move error handling to "Continue" buttons for each page section

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

    if (typeof royalties === 'undefined' || isNaN(parseFloat(royalties))) {
      errors.push("set the collection's royalties");
    }

    if (typeof editionSize === 'undefined' || isNaN(parseInt(editionSize))) {
      errors.push(
        "set the template's maximum edition size (0 for no maximum edition size)"
      );
    }

    if (typeof mintAmount === 'undefined' || isNaN(parseInt(mintAmount))) {
      errors.push('set the initial mint amount (minimum 1)');
    }

    if (errors.length === 1) {
      setFormError(`Please ${errors[0]}.`);
      console.log(formError); // TODO: Remove in WEB-919
      return;
    }

    if (errors.length === 2) {
      setFormError(`Please ${errors[0]} and ${errors[1]}.`);
      console.log(formError); // TODO: Remove in WEB-919
      return;
    }

    try {
      const templateIpfsImage = await uploadToIPFS(templateUploadedFile);

      const result = isUncreatedCollectionSelected
        ? await ProtonSDK.createNft({
            requiredAccountRam: 1500,
            requiredSpecialMintContractRam: parseInt(mintAmount) * 151,
            author: currentUser.actor,
            collection_name: newCollection.collection_name,
            collection_description: newCollection.description,
            collection_display_name: newCollection.name,
            collection_image: newCollection.img,
            collection_market_fee: (parseInt(royalties) / 100).toFixed(6),
            template_name: templateName,
            template_description: templateDescription,
            template_image: templateIpfsImage,
            template_video: templateVideo,
            max_supply: parseInt(editionSize),
            initial_mint_amount: parseInt(mintAmount),
          })
        : await ProtonSDK.createTemplateAssets({
            requiredAccountRam: 1500,
            requiredSpecialMintContractRam: parseInt(mintAmount) * 151,
            author: currentUser.actor,
            collection_name: selectedCollection.name,
            template_name: templateName,
            template_image: templateIpfsImage,
            template_video: templateVideo,
            template_description: templateDescription,
            max_supply: parseInt(editionSize),
            initial_mint_amount: parseInt(mintAmount),
          });

      if (!result.success) {
        setFormError('Unable to create the NFT. Please try again.');
        return;
      }

      setPageState(CREATE_PAGE_STATES.SUCCESS);
    } catch (err) {
      setFormError('Unable to create the NFT. Please try again.');
    }
  };

  const getContent = () => {
    if (!currentUser) {
      return null;
    }

    if (!isDesktop) {
      return <MobileCreatePagePlaceholder />;
    }

    switch (pageState) {
      case CREATE_PAGE_STATES.SUCCESS:
        return (
          <NftCreateSuccess
            backToChooseCollection={() =>
              setPageState(CREATE_PAGE_STATES.CHOOSE_COLLECTION)
            }
          />
        );
      default:
        return (
          <Container>
            <Row>
              <LeftColumn>
                <Title>Create new NFT</Title>
                <SubTitle>
                  Every new account can create up to 10 NFTs for free. After
                  that a small fee per NFT is charged reflecting network costs.
                </SubTitle>
                <ElementTitle>Upload file</ElementTitle>
                <DragDropFileUploadLg
                  setFormError={setFormError}
                  setTemplateUploadedFile={setTemplateUploadedFile}
                  templateUploadedFile={templateUploadedFile}
                />
                <ElementTitle>Choose Collection</ElementTitle>
                <CollectionsCarousel
                  collectionsList={collectionsList}
                  selectedCollection={selectedCollection}
                  newCollection={newCollection}
                  getUserCollections={getUserCollections}
                  setSelectedCollection={setSelectedCollection}
                  setNewCollection={setNewCollection}
                  setIsUncreatedCollectionSelected={
                    setIsUncreatedCollectionSelected
                  }
                  error={error}
                  isLoading={isLoadingCollections}
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
                <Row>
                  <InputField
                    mt="16px"
                    mr="4px"
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
                        !isNaN(numberInput) &&
                        numberInput >= 0 &&
                        numberInput <= 15;
                      const errorMessage =
                        'Royalties must be between 0% and 15%';
                      return {
                        isValid,
                        errorMessage,
                      };
                    }}
                  />
                  <InputField
                    mt="16px"
                    ml="4px"
                    inputType="number"
                    min={0}
                    step={1}
                    value={editionSize}
                    setValue={setEditionSize}
                    placeholder="Edition Size"
                    tooltip="The number of tokens created"
                    numberOfTooltipLines={1}
                  />
                </Row>
                <ElementTitle>Initial Mint</ElementTitle>
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
                <TermsLink
                  target="_blank"
                  href="https://www.protonchain.com/terms">
                  Terms of Service &amp; Privacy Policy
                </TermsLink>
                <Button onClick={createNft}>Create NFT</Button>
              </LeftColumn>
              <RightColumn>
                <ElementTitle>Preview</ElementTitle>
                <TemplateCard
                  templateVideo={templateVideo}
                  templateImage={templateImage}
                  templateName={templateName}
                  collectionImage={selectedCollection.img}
                  collectionName={
                    selectedCollection.name ||
                    selectedCollection.collection_name
                  }
                  editionSize={editionSize}
                  noHoverEffect
                  noIpfsConversion
                  isStatic
                  autoPlay
                />
              </RightColumn>
            </Row>
          </Container>
        );
    }
  };

  return <PageLayout title="Create">{getContent()}</PageLayout>;
};

export default Create;
