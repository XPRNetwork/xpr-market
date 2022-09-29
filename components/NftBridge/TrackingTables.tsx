import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useToasts } from 'react-toast-notifications';
import proton, { TeleportOutReqs } from '../../services/proton-rpc';
import { getDepositList } from '../../services/ethereum';
import { claimNfts } from '../../services/ethereum';
import { shortenAddress } from '../../utils';
import Button from '../Button';
import Spinner from '../Spinner';
import TableHeaderRow from '../TableHeaderRow';
import TableRow from '../TableRow';
import { TableHeaderCell, TableDataCell } from './NftBridge.styled';
import TableContentWrapper from '../TableContentWraper';

enum TABS {
  OUT_REQS = 'outreqs',
  MINTED = 'minted',
  DEPOSIT_LIST = 'depositList'
}

interface TrackingProps {};

const tableHeaders = [
  { title: '#', id: '#' },
  { title: 'OWNER', id: 'owner' },
  { title: 'COLLECTION', id: 'collection' },
  { title: 'TOKEN ID', id: 'tokenId' },
  { title: 'CLAIM', id: 'claim' },
]

export const TrackingTables = (props: TrackingProps) => {
  const { library, account } = useWeb3React();
  const { addToast } = useToasts();

  const [selectedTab, setSelectedTab] = useState<TABS>(TABS.DEPOSIT_LIST);
  const [outreqs, setOutreqs] = useState<TeleportOutReqs[]>([]);
  const [minted, setMinted] = useState([]);
  const [depositList, setDepositList] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (selectedTab === TABS.OUT_REQS) {
      fetchOutreqs();
    } else if (selectedTab === TABS.MINTED) {
      fetchMinted();
    } else if (selectedTab === TABS.DEPOSIT_LIST) {
      fetchDepositList();
    }
  }, [selectedTab, account]);

  const fetchOutreqs = async () => {
    setIsLoading(true);
    setOutreqs([]);
    const rows = await proton.getOutReqsForTeleport();
    setOutreqs(rows);
    setIsLoading(false);
  }

  const fetchMinted = async () => {
    setIsLoading(true);
    setMinted([]);
    const rows = await proton.getMintedForTeleport();
    setMinted(rows);
    setIsLoading(false);
  }

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
    } catch (err) {
      addToast('Claim failed.', { appearance: 'error', autoDismiss: true });
      setIsLoading(false);
      console.log("claim error", err);
    }
  }

  return (
    <>
      {isLoading && <Spinner></Spinner>}
      {/* deposit list table */}
      {!isLoading && selectedTab === TABS.DEPOSIT_LIST &&
      <table style={{width: '100%'}}>
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
            loading={isLoading}
            noData={!depositList.length}
            columns={tableHeaders.length}
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
      </table>}
    </>
  )
}
