import { Dispatch, SetStateAction, ReactNode } from 'react';
import Image from 'next/image';
import {
  Container,
  Row,
  Column,
  ImageContainer,
  TabTitle,
  TabRow,
} from './DetailsLayout.styled';
import SalesHistoryTable from '../SalesHistoryTable';
import AssetFormTitle from '../AssetFormTitle';
import { Sale, SaleAsset } from '../../services/sales';
import { Asset } from '../../services/assets';
import { tabs } from '../../components/SalesHistoryTable';
import { IPFS_RESOLVER } from '../../utils/constants';

type Props = {
  children: ReactNode;
  image: string;
  templateId: string;
  templateName: string;
  collectionName: string;
  collectionAuthor: string;
  sales: Sale[];
  error?: string;
  currentAsset?: Partial<SaleAsset> & Partial<Asset>;
  transferNFT?: () => void;
  assetIds?: string[];
  saleIds?: string[];
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
};

const AssetImage = ({ image }: { image: string }): JSX.Element => (
  <ImageContainer>
    <Image
      priority
      layout="responsive"
      width={456}
      height={470}
      src={`${IPFS_RESOLVER}${image}`}
    />
  </ImageContainer>
);

const DetailsLayout = ({
  children,
  image,
  templateId,
  templateName,
  collectionName,
  collectionAuthor,
  sales,
  error,
  currentAsset,
  transferNFT,
  assetIds,
  saleIds,
  activeTab,
  setActiveTab,
}: Props): JSX.Element => {
  return (
    <Container>
      <Row>
        <AssetImage image={image} />
        <Column>
          <AssetFormTitle
            templateName={templateName}
            collectionName={collectionName}
            collectionAuthor={collectionAuthor}
            transferNFT={transferNFT}
            saleIds={saleIds}
            assetIds={assetIds}
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
