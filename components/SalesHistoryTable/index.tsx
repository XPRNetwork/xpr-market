import { useState, useEffect } from 'react';
import TableHeaderRow from '../TableHeaderRow';
import TableHeaderCell from '../TableHeaderCell';
import TableRow from '../TableRow';
import TableContentWrapper from '../TableContentWraper';
import SalesHistoryTableCell from '../SalesHistoryTableCell';
import PaginationButton from '../../components/PaginationButton';
import { addPrecisionDecimal, parseTimestamp } from '../../utils';
import { StyledTable } from './SalesHistoryTable.styled';
import { useWindowSize } from '../../hooks';
import { getFromApi } from '../../utils/browser-fetch';
import { useAuthContext } from '../Provider';
import { SaleAsset, Sale } from '../../services/sales';
import { Asset } from '../../services/assets';
import { PAGINATION_LIMIT } from '../../utils/constants';
import { getSalesHistory } from '../../services/sales';

type Props = {
  tableData: Sale[];
  error?: string;
  asset?: Partial<SaleAsset> & Partial<Asset>;
  activeTab: string;
  templateId: string;
};

type TableHeader = {
  title: string;
  id: string;
};

export const TAB_TYPES = {
  ITEM: 'ITEM',
  GLOBAL: 'GLOBAL',
};

export const tabs = [
  { title: 'Item History', type: TAB_TYPES.ITEM },
  { title: 'Global History', type: TAB_TYPES.GLOBAL },
];

const salesHistoryTableHeaders = [
  { title: '', id: 'img' },
  { title: 'BUYER', id: 'buyer' },
  { title: 'PRICE', id: 'price' },
  { title: 'SERIAL', id: 'serial' },
  { title: 'DATE/TIME', id: 'date' },
  { title: 'TX', id: 'tx' },
];

const mobileSalesHistoryTableHeaders = [
  { title: '', id: 'img' },
  { title: 'BUYER', id: 'buyer' },
  { title: 'PRICE', id: 'price' },
  { title: 'TX', id: 'tx' },
];

const getAvatars = async (
  chainAccounts: string[]
): Promise<{ [chainAccount: string]: string }> => {
  try {
    const queryString = chainAccounts
      .map((account) => encodeURIComponent(account))
      .join('&accounts=');

    const res = await getFromApi<{ [account: string]: string }>(
      `/api/profile?accounts=${queryString}`
    );

    if (!res.success) {
      throw new Error((res.message as unknown) as string);
    }

    return res.message;
  } catch (e) {
    throw new Error(e);
  }
};

const SalesHistoryTable = ({
  tableData,
  error,
  asset,
  activeTab,
  templateId,
}: Props): JSX.Element => {
  const { currentUser } = useAuthContext();
  const [avatars, setAvatars] = useState({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState<boolean>(true);
  const [renderedData, setRenderedData] = useState<Sale[]>([]);
  const [prefetchedData, setPrefetchedData] = useState<Sale[]>([]);
  const [prefetchPageNumber, setPrefetchPageNumber] = useState<number>();
  const [errorMessage, setErrorMessage] = useState<string>(error);
  const [tableHeaders, setTableHeaders] = useState<TableHeader[]>([]);
  const { isMobile } = useWindowSize();

  useEffect(() => {
    setIsLoading(true);
    setRenderedData(tableData);
    setPrefetchPageNumber(2);
  }, [tableData]);

  useEffect(() => {
    if (isMobile) {
      setTableHeaders(mobileSalesHistoryTableHeaders);
    } else {
      setTableHeaders(salesHistoryTableHeaders);
    }
  }, [isMobile]);

  useEffect(() => {
    (async () => {
      try {
        if (renderedData.length) {
          const chainAccounts = renderedData.map(({ buyer }) => buyer);
          const res = await getAvatars(chainAccounts);
          setAvatars(res);
        }
      } catch (e) {
        setErrorMessage(e.message);
      }
      setIsLoading(false);
    })();
  }, [renderedData, activeTab]);

  useEffect(() => {
    (async () => {
      try {
        if (
          !isLoading &&
          renderedData.length &&
          renderedData.length % PAGINATION_LIMIT == 0 &&
          asset
        ) {
          await prefetchNextPage();
        }
      } catch (e) {
        setErrorMessage(e.message);
      }
    })();
  }, [isLoading, renderedData, asset]);

  useEffect(() => {
    if (currentUser) {
      setAvatars({
        ...avatars,
        [currentUser.actor]: currentUser.avatar,
      });
    }
  }, [currentUser]);

  const getTableContent = () => {
    return renderedData.map((sale) => {
      return (
        <TableRow key={sale.sale_id}>
          {tableHeaders.map(({ id }) => {
            const content = getCellContent(sale, id, avatars);
            return <SalesHistoryTableCell key={id} id={id} content={content} />;
          })}
        </TableRow>
      );
    });
  };

  const prefetchNextPage = async () => {
    const prefetchedResult = await getSalesHistory({
      id: activeTab === TAB_TYPES.ITEM ? asset.assetId : templateId,
      type: activeTab,
      page: prefetchPageNumber,
    });

    setPrefetchedData(prefetchedResult as Sale[]);

    if (!prefetchedResult.length) {
      setPrefetchPageNumber(-1);
    } else {
      setPrefetchPageNumber(prefetchPageNumber + 1);
    }

    setIsLoadingNextPage(false);
  };

  const showNextPage = async () => {
    setRenderedData(renderedData.concat(prefetchedData));
    setIsLoadingNextPage(true);
    await prefetchNextPage();
  };

  const noDataMessage =
    activeTab === TAB_TYPES.GLOBAL ||
    !(asset.templateMint || asset.template_mint)
      ? 'No Recent Sales'
      : `No Recent Sales for Serial #${
          asset.templateMint || asset.template_mint
        }`;

  return (
    <>
      <StyledTable aria-label="sales-history-table" role="table">
        <thead>
          <TableHeaderRow>
            {tableHeaders.map((header) => {
              return (
                <TableHeaderCell key={header.title}>
                  {header.title}
                </TableHeaderCell>
              );
            })}
          </TableHeaderRow>
        </thead>
        <tbody>
          <TableContentWrapper
            error={
              errorMessage ? `An error has occurred: ${errorMessage}` : null
            }
            loading={isLoading}
            noData={!renderedData.length}
            noDataMessage={noDataMessage}
            columns={tableHeaders.length}>
            {getTableContent()}
          </TableContentWrapper>
        </tbody>
      </StyledTable>
      <PaginationButton
        onClick={showNextPage}
        isHidden={renderedData.length < PAGINATION_LIMIT}
        isLoading={isLoadingNextPage}
        disabled={prefetchPageNumber === -1}
      />
    </>
  );
};

const getCellContent = (sale, id, avatars) => {
  switch (id) {
    case 'img': {
      return avatars[sale.buyer];
    }
    case 'buyer': {
      return sale.buyer;
    }
    case 'price': {
      const { amount, token_precision, token_symbol } = sale.price;
      const price = `${addPrecisionDecimal(
        amount,
        token_precision
      )} ${token_symbol}`;
      return price;
    }
    case 'serial': {
      const { assets, asset_serial } = sale;
      const asset = assets[0];
      const serial = asset.template_mint;
      return asset_serial || serial;
    }
    case 'date': {
      const timeInUnix = sale.updated_at_time;
      const date = parseTimestamp(timeInUnix);
      return date;
    }
    case 'tx': {
      return sale.updated_at_block;
    }
  }
};

export default SalesHistoryTable;
