import { Dispatch, SetStateAction, ReactNode } from 'react';
import Image from 'next/image';
import {
  Container,
  Row,
  Column,
  ImageContainer,
  TabTitle,
  TabRow,
  Video,
} from './DetailsLayout.styled';
import SalesHistoryTable from '../SalesHistoryTable';
import AssetFormTitle from '../AssetFormTitle';
import { Sale, SaleAsset } from '../../services/sales';
import { Asset } from '../../services/assets';
import { tabs } from '../../components/SalesHistoryTable';
import { IPFS_RESOLVER } from '../../utils/constants';

type Props = {
  children: ReactNode;
  image?: string;
  video?: string;
  templateId: string;
  templateName: string;
  collectionName: string;
  collectionAuthor: string;
  collectionImage: string;
  sales: Sale[];
  error?: string;
  currentAsset?: Partial<SaleAsset> & Partial<Asset>;
  assetIds?: string[];
  saleIds?: string[];
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  setCurrentAssetAsModalProps?: () => void;
};

const AssetImage = ({ image }: { image: string }): JSX.Element => (
  <ImageContainer>
    <Image
      priority
      layout="responsive"
      objectFit="contain"
      width={456}
      height={470}
      src={`${IPFS_RESOLVER}${image}`}
    />
  </ImageContainer>
);

const AssetVideo = ({ video }: { video: string }): JSX.Element => (
  <ImageContainer>
    <Video controls muted src={`${IPFS_RESOLVER}${video}`} />
  </ImageContainer>
);

const DetailsLayout = ({
  children,
  image,
  video,
  templateId,
  templateName,
  collectionName,
  collectionAuthor,
  collectionImage,
  sales,
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
        {video ? <AssetVideo video={video} /> : <AssetImage image={image} />}
        <Column>
          <AssetFormTitle
            templateName={templateName}
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
        tableData={sales}
        error={error}
        asset={currentAsset}
        templateId={templateId}
      />
    </Container>
  );
};

export default DetailsLayout;
