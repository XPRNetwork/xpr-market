import { Dispatch, SetStateAction, ReactNode } from 'react';
import {
  Container,
  Row,
  Column,
  ImageContainer,
  TabTitle,
  TabRow,
  Video,
  TemplateImage,
} from './DetailsLayout.styled';
import SalesHistoryTable from '../SalesHistoryTable';
import AssetFormTitle from '../AssetFormTitle';
import { SaleAsset } from '../../services/sales';
import { Asset } from '../../services/assets';
import { tabs } from '../../components/SalesHistoryTable';
import { IPFS_RESOLVER } from '../../utils/constants';

type Props = {
  children: ReactNode;
  image?: string;
  video?: string;
  templateId: string;
  templateName: string;
  collectionDisplayName?: string;
  collectionName: string;
  collectionAuthor: string;
  collectionImage: string;
  error?: string;
  currentAsset?: Partial<SaleAsset> & Partial<Asset>;
  assetIds?: string[];
  saleIds?: string[];
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  setCurrentAssetAsModalProps?: () => void;
};

const AssetImage = ({
  image,
  templateName,
}: {
  image: string;
  templateName: string;
}): JSX.Element => (
  <ImageContainer>
    <TemplateImage src={`${IPFS_RESOLVER}${image}`} alt={templateName} />
  </ImageContainer>
);

const AssetVideo = ({ video }: { video: string }): JSX.Element => (
  <ImageContainer>
    <Video
      controls
      loop
      autoPlay
      onLoadStart={setVolumeOnLoad}
      src={`${IPFS_RESOLVER}${video}`}
    />
  </ImageContainer>
);

const setVolumeOnLoad = () => {
  document.getElementsByTagName('video')[0].volume = 0.15;
};

const DetailsLayout = ({
  children,
  image,
  video,
  templateId,
  templateName,
  collectionName,
  collectionDisplayName,
  collectionAuthor,
  collectionImage,
  error,
  currentAsset,
  assetIds,
  saleIds,
  activeTab,
  setActiveTab,
  setCurrentAssetAsModalProps,
}: Props): JSX.Element => {
  return (
    <Container>
      <Row>
        {video ? (
          <AssetVideo video={video} />
        ) : (
          <AssetImage image={image} templateName={templateName} />
        )}
        <Column>
          <AssetFormTitle
            templateName={templateName}
            collectionDisplayName={collectionDisplayName}
            collectionName={collectionName}
            collectionAuthor={collectionAuthor}
            collectionImage={collectionImage}
            saleIds={saleIds}
            assetIds={assetIds}
            setCurrentAssetAsModalProps={setCurrentAssetAsModalProps}
          />
          {children}
        </Column>
      </Row>
      <TabRow>
        {tabs.map(({ type, title }) => {
          return (
            <TabTitle
              key={type}
              onClick={() => setActiveTab(type)}
              isActive={activeTab === type}>
              {title}
            </TabTitle>
          );
        })}
      </TabRow>
      <SalesHistoryTable
        activeTab={activeTab}
        error={error}
        asset={currentAsset}
        templateId={templateId}
      />
    </Container>
  );
};

export default DetailsLayout;
