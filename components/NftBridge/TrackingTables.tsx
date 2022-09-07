import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useToasts } from 'react-toast-notifications';
import { TableContent, Tabs, Tab } from './NftBridge.styled';
import proton, { TeleportOutReqs } from '../../services/proton-rpc';
import { getDepositList } from '../../services/ethereum';
import { claimNfts } from '../../services/ethereum';
import { shortenAddress } from '../../utils';
import Button from '../Button';

const enum TABS {
  OUT_REQS = 'outreqs',
  MINTED = 'minted',
  DEPOSIT_LIST = 'depositList'
}

interface TrackingProps {
  fetchEthAssets: () => void
};

export const TrackingTables = (props: TrackingProps) => {
  const { library, account } = useWeb3React();
  const { addToast } = useToasts();

  const [selectedTab, setSelectedTab] = useState<TABS>(TABS.OUT_REQS);
  const [outreqs, setOutreqs] = useState<TeleportOutReqs[]>([]);
  const [minted, setMinted] = useState([]);
  const [depositList, setDepositList] = useState([]);

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
    setOutreqs([]);
    const rows = await proton.getOutReqsForTeleport();
    setOutreqs(rows);
  }

  const fetchMinted = async () => {
    setMinted([]);
    const rows = await proton.getMintedForTeleport();
    setMinted(rows);
  }

  const fetchDepositList = async () => {
    if (!library) return;

    setDepositList([]);
    const res = await getDepositList(account, library.getSigner());
    const filtered = res?.filter(el => !el.locked);
    setDepositList(filtered);
  }

  const claimEth = async (contract: string, tokenId: string) => {
    if (!library) {
      addToast('Please connect your Ethereum wallet', { appearance: 'error', autoDismiss: true });
      return;
    }

    try {
      const txPreHash = await claimNfts(contract, [tokenId], library.getSigner());
      await txPreHash.wait();
      addToast('Claimed successfully!', { appearance: 'success', autoDismiss: true });
      props.fetchEthAssets();
      await fetchDepositList();
    } catch (err) {
      addToast('Claim failed.', { appearance: 'error', autoDismiss: true });
      console.log("claim error", err);
    }
  }

  return (
    <TableContent>
      <Tabs>
        <Tab
          selected={selectedTab == TABS.OUT_REQS}
          onClick={() => setSelectedTab(TABS.OUT_REQS)}
        >
          OUTREQS
        </Tab>
        {/* <Tab
          selected={selectedTab == TABS.MINTED}
          onClick={() => setSelectedTab(TABS.MINTED)}
        >
          MINTED
        </Tab> */}
        <Tab
          selected={selectedTab == TABS.DEPOSIT_LIST}
          onClick={() => setSelectedTab(TABS.DEPOSIT_LIST)}
        >
          DEPOSIT LIST
        </Tab>
      </Tabs>
      
      {/* outreqs table */}
      {selectedTab == TABS.OUT_REQS && <table>
        <thead style={{color: '#4710a3'}}>
          <th style={{padding: 15}}>#</th>
          <th style={{padding: 15}}>Asset ID</th>
          <th style={{padding: 15}}>Chain ID</th>
          <th style={{padding: 15}}>Contract</th>
          <th style={{padding: 15}}>To Address</th>
          <th style={{padding: 15}}>Token ID</th>
          <th style={{padding: 15}}>Created</th>
        </thead>
        <tbody>
          {outreqs.length > 0 && outreqs.map((el, idx) => (
            <tr key={idx} style={{textAlign: 'center', color: '#6a6a6a'}}>
              <td>{idx + 1}</td>
              <td style={{padding: 15}}>{el.asset_id}</td>
              <td style={{padding: 15}}>{el.chain_id}</td>
              <td style={{padding: 15}}>{shortenAddress("0x" + el.contract_address)}</td>
              <td style={{padding: 15}}>{shortenAddress("0x" + el.to_address)}</td>
              <td style={{padding: 15}}>{el.token_id}</td>
              <td style={{padding: 15}}>{el.created_on}</td>
            </tr>
          ))}
        </tbody>
      </table>}

      {/* minted table */}
      {/* {selectedTab === TABS.MINTED && <table>
        <thead style={{color: '#4710a3'}}>
          <th style={{padding: 15}}>#</th>
          <th style={{padding: 15}}>Asset ID</th>
          <th style={{padding: 15}}>Hash</th>
        </thead>
        <tbody>
          {minted.length > 0 && minted.map((el, idx) => (
            <tr key={idx} style={{textAlign: 'center', color: '#6a6a6a'}}>
              <td style={{padding: 15}}>{idx + 1}</td>
              <td style={{padding: 15}}>{el.asset_id}</td>
              <td style={{padding: 15}}>{shortenAddress(el.uniq_hash)}</td>
            </tr>
          ))}
        </tbody>
      </table>} */}

      {/* deposit list table */}
      {selectedTab === TABS.DEPOSIT_LIST && <table>
        <thead style={{color: '#4710a3'}}>
          <th style={{padding: 15}}>#</th>
          <th style={{padding: 15}}>OWNER</th>
          <th style={{padding: 15}}>COLLECTION</th>
          <th style={{padding: 15}}>TOKEN ID</th>
          {/* <th style={{padding: 15}}>LOCKED</th> */}
        </thead>
        <tbody>
          {depositList.length > 0 && depositList.map((el, idx) => (
            <tr key={idx} style={{textAlign: 'center', color: '#6a6a6a'}}>
              <td style={{padding: 15}}>{idx + 1}</td>
              <td style={{padding: 15}}>{shortenAddress(el.owner)}</td>
              <td style={{padding: 15}}>{shortenAddress(el.collection)}</td>
              <td style={{padding: 15}}>{el.tokenId.toHexString()}</td>
              <td style={{padding: 15}}>{el.locked ? 'Locked' : 'Unlocked'}</td>
              <td>
                <Button
                  smallSize={true}
                  disabled={el.locked}
                  onClick={() => claimEth(el.collection, el.tokenId.toHexString())}
                >
                  Claim
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>}
    </TableContent>
  )
}
