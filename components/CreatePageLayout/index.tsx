import TemplateCard from '../TemplateCard';
import {
  Container,
  Row,
  LeftColumn,
  RightColumn,
  ElementTitle,
} from './CreatePageLayout.styled';
import { CarouselCollection } from '../CollectionsCarousel';

type Props = {
  children: JSX.Element;
  templateVideo: string;
  templateImage: string;
  templateName: string;
  selectedCollection: CarouselCollection;
  editionSize: string;
};

const CreatePageLayout = ({
  children,
  templateVideo,
  templateImage,
  templateName,
  selectedCollection,
  editionSize,
}: Props): JSX.Element => {
  console.log('selectedCollection', selectedCollection)
  return (
    <Container>
      <Row>
        <LeftColumn>{children}</LeftColumn>
        <RightColumn>
          <ElementTitle>Preview</ElementTitle>
          <TemplateCard
            templateVideo={templateVideo}
            templateImage={templateImage}
            templateName={templateName}
            collectionImage={selectedCollection.img}
            collectionName={
              selectedCollection.name || selectedCollection.collection_name
            }
            editionSize={editionSize}
            noHoverEffect
            noIpfsConversion
            isStatic
            autoPlay
            hasPlaceholderIcon={!selectedCollection.name}
          />
        </RightColumn>
      </Row>
    </Container>
  );
};

export default CreatePageLayout;
