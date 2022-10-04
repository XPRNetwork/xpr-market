import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useToasts } from 'react-toast-notifications';
import { getDepositList } from '../../services/ethereum';
import { claimNfts } from '../../services/ethereum';
import { shortenAddress } from '../../utils';
import Button from '../Button';
import Spinner from '../Spinner';
import TableHeaderRow from '../TableHeaderRow';
import TableRow from '../TableRow';
import { TableWrapper, Table, TableHeaderCell, TableDataCell } from './NftBridge.styled';
import TableContentWrapper from '../TableContentWraper';

// interface TrackingProps {};

export const TrackingTables = () => {
  const { library, account } = useWeb3React();
  const { addToast } = useToasts();

  const [depositList, setDepositList] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchDepositList();
  }, [account]);

  const fetchDepositList = async () => {
    if (!library) return;

    setIsLoading(true);
    setDepositList([]);
    const res = await getDepositList(account, library.getSigner());
    const filtered = res?.filter(el => !el.locked);
    setDepositList(filtered);
    setIsLoading(false);
  }

  const claimEth = async (contract: string, tokenId: string) => {
    if (!library) {
      addToast('Please connect your Ethereum wallet', { appearance: 'error', autoDismiss: true });
      return;
    }

    try {
      setIsLoading(true);
      const txPreHash = await claimNfts(contract, [tokenId], library.getSigner());
      await txPreHash.wait();
      addToast('Claimed successfully!', { appearance: 'success', autoDismiss: true });
      // Refresh deposit list
      await fetchDepositList();
    } catch (err) {
      addToast('Claim failed.', { appearance: 'error', autoDismiss: true });
      setIsLoading(false);
      console.log("claim error", err);
    }
  }

  return (
    <>
      {isLoading && <Spinner></Spinner>}

      {!isLoading && <TableWrapper>
        <Table>
          <thead>
            <TableHeaderRow>
              <TableHeaderCell width={5}>#</TableHeaderCell>
              <TableHeaderCell width={25}>OWNER</TableHeaderCell>
              <TableHeaderCell width={25}>COLLECTION</TableHeaderCell>
              <TableHeaderCell width={25}>TOKEN ID</TableHeaderCell>
              <TableHeaderCell width={20}>ACTIONS</TableHeaderCell>
            </TableHeaderRow>
          </thead>
          <tbody>
            <TableContentWrapper
              loading={isLoading}
              noData={!depositList.length}
              columns={5}
            >
              {depositList.length > 0 && depositList.map((el, idx) => (
                <TableRow key={idx}>
                  <TableDataCell >{idx + 1}</TableDataCell>
                  <TableDataCell >{shortenAddress(el.owner)}</TableDataCell>
                  <TableDataCell >{shortenAddress(el.collection)}</TableDataCell>
                  <TableDataCell >{el.tokenId.toHexString().length > 15 ? shortenAddress(el.tokenId.toHexString()) : el.tokenId.toHexString()}</TableDataCell>
                  <TableDataCell>
                    <Button
                      smallSize={true}
                      disabled={el.locked}
                      onClick={() => claimEth(el.collection, el.tokenId.toHexString())}
                    >
                      Claim
                    </Button>
                  </TableDataCell>
                </TableRow>
              ))}
            </TableContentWrapper>
          </tbody>
        </Table>
      </TableWrapper>}
    </>
  )
}
