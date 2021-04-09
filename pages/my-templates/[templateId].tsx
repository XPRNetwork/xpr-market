import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import DetailsLayout from '../../components/DetailsLayout';
import ErrorComponent from '../../components/Error';
import PageLayout from '../../components/PageLayout';
import AssetFormSell from '../../components/AssetFormSell';
import LoadingPage from '../../components/LoadingPage';
import {
  useAuthContext,
  useModalContext,
  MODAL_TYPES,
} from '../../components/Provider';
import { getTemplateDetails, Template } from '../../services/templates';
import {
  getUserTemplateAssets,
  Asset,
  FullSaleDataByAssetId,
} from '../../services/assets';
import { Sale } from '../../services/sales';
import { DEFAULT_COLLECTION } from '../../utils/constants';
import { getSalesHistory } from '../../services/sales';
import { TAB_TYPES } from '../../components/SalesHistoryTable';

const emptyTemplateDetails = {
  lowestPrice: '',
  max_supply: '',
  collection: {
    author: '',
    collection_name: '',
    data: {
      name: '',
      img: '',
      description: '',
    },
  },
  immutable_data: {
    image: '',
    name: '',
    series: 0,
    desc: '',
  },
};

type Query = {
  [query: string]: string;
};

const MyNFTsTemplateDetail = (): JSX.Element => {
  const router = useRouter();
  const { templateId } = router.query as Query;
  const { currentUser } = useAuthContext();
  const { openModal, setModalProps } = useModalContext();
  const [sales, setSales] = useState<Sale[]>([]);
  const [templateAssets, setTemplateAssets] = useState<Asset[]>([]);
  const [
    saleDataByAssetId,
    setSaleDataByAssetId,
  ] = useState<FullSaleDataByAssetId>({});
  const [template, setTemplate] = useState<Template>(emptyTemplateDetails);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [currentAsset, setCurrentAsset] = useState<Partial<Asset>>({});
  const [assetIds, setAssetIds] = useState<string[]>([]);
  const [saleIds, setSaleIds] = useState<string[]>();
  const [activeTab, setActiveTab] = useState<string>(TAB_TYPES.ITEM);

  const isSelectedAssetBeingSold =
    saleDataByAssetId[currentAsset.asset_id] &&
    saleDataByAssetId[currentAsset.asset_id].rawPrice;
  const {
    lowestPrice,
    max_supply,
    collection: { author, collection_name },
    immutable_data: { image, name, desc },
  } = template;

  const fetchPageData = async () => {
    try {
      const owner = currentUser ? currentUser.actor : '';
      setIsLoading(true);

      const templateDetails = await getTemplateDetails(
        DEFAULT_COLLECTION,
        templateId
      );

      const { assets, saleData } = await getUserTemplateAssets(
        owner,
        templateId
      );

      const assetIds = assets
        .filter(({ asset_id }) => !saleData[asset_id])
        .map(({ asset_id }) => asset_id);

      const saleIds = Object.values(saleData).map(({ saleId }) => saleId);

      setModalProps({
        saleIds,
        assetIds,
        fetchPageData,
      });

      setAssetIds(assetIds);
      setSaleIds(saleIds);
      setTemplateAssets(assets);
      setCurrentAsset(assets[0]);
      setSaleDataByAssetId(saleData);
      setIsLoading(false);
      setTemplate(templateDetails);
      setIsLoading(false);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    try {
      (async () => {
        const historyId =
          activeTab === TAB_TYPES.ITEM ? currentAsset.asset_id : templateId;
        const sales = await getSalesHistory({ id: historyId, type: activeTab });
        setSales(sales);
      })();
    } catch (e) {
      setError(e.message);
    }
  }, [currentAsset, activeTab]);

  useEffect(() => {
    if (templateId) {
      fetchPageData();
    }
  }, [templateId]);

  const transferNFT = () => {
    openModal(MODAL_TYPES.TRANSFER);
    setModalProps({
      assetId: currentAsset.asset_id,
      templateMint: currentAsset.template_mint,
      fetchPageData,
    });
  };

  const createSale = () => {
    openModal(MODAL_TYPES.CREATE_SALE);
    setModalProps({
      assetId: currentAsset.asset_id,
      fetchPageData,
    });
  };

  const cancelSale = () => {
    openModal(MODAL_TYPES.CANCEL_SALE);
    setModalProps({
      saleId: saleDataByAssetId[currentAsset.asset_id].saleId,
      fetchPageData,
    });
  };

  const handleButtonClick = isSelectedAssetBeingSold ? cancelSale : createSale;

  const buttonText = isSelectedAssetBeingSold ? 'Cancel Sale' : 'Mark for sale';

  const getContent = () => {
    if (error) {
      return (
        <ErrorComponent
          errorMessage={error}
          buttonText="Try again"
          buttonOnClick={() => router.reload()}
        />
      );
    }

    if (isLoading) {
      return <LoadingPage />;
    }

    return (
      <DetailsLayout
        templateId={templateId}
        templateName={name}
        collectionName={collection_name}
        collectionAuthor={author}
        sales={sales}
        error={error}
        image={image}
        currentAsset={currentAsset}
        transferNFT={transferNFT}
        assetIds={assetIds}
        saleIds={saleIds}
        activeTab={activeTab}
        setActiveTab={setActiveTab}>
        <AssetFormSell
          description={desc}
          dropdownAssets={templateAssets}
          lowestPrice={lowestPrice}
          maxSupply={max_supply}
          buttonText={buttonText}
          assetId={currentAsset.asset_id}
          handleButtonClick={handleButtonClick}
          setCurrentAsset={setCurrentAsset}
        />
      </DetailsLayout>
    );
  };

  return <PageLayout title={`${name} Details`}>{getContent()}</PageLayout>;
};

export default MyNFTsTemplateDetail;
