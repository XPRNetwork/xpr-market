import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import Button from '../components/Button';
import TemplateCard from '../components/TemplateCard';
import InputField from '../components/InputField';
import DragDropFileUploadLg from '../components/DragDropFileUploadLg';
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
} from '../styles/CreatePage';

const Create = (): JSX.Element => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [royalties, setRoyalties] = useState<string>('');
  const [editionSize, setEditionSize] = useState<string>('');
  const [mintAmount, setMintAmount] = useState<string>('');
  const [templateUploadedFile, setTemplateUploadedFile] = useState<File | null>(
    null
  );

  return (
    <PageLayout title="Create">
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
            />
            <ElementTitle>Choose Collection</ElementTitle>
            <Row>
              <EmptyBox2 />
              <EmptyBox2 />
            </Row>
            <InputField
              mt="16px"
              value={name}
              setValue={setName}
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
                tooltip=" "
                numberOfTooltipLines={1}
              />
              <InputField
                mt="16px"
                ml="4px"
                value={editionSize}
                setValue={setEditionSize}
                placeholder="Edition Size"
                tooltip=" "
                numberOfTooltipLines={1}
              />
            </Row>
            <ElementTitle>Initial Mint</ElementTitle>
            <InputField
              value={mintAmount}
              setValue={setMintAmount}
              placeholder="Mint Amount"
              tooltip=" "
              numberOfTooltipLines={1}
            />
            <Terms>By clicking “Create NFT” you agree to our</Terms>
            <TermsLink target="_blank" href="https://www.protonchain.com/terms">
              Terms of Service &amp; Privacy Policy
            </TermsLink>
            <Button onClick={null}>Create NFT</Button>
          </LeftColumn>
          <RightColumn>
            <ElementTitle>Preview</ElementTitle>
            <TemplateCard />
          </RightColumn>
        </Row>
      </Container>
    </PageLayout>
  );
};

export default Create;
