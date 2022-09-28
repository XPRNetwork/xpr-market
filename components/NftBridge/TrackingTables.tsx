import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useToasts } from 'react-toast-notifications';
import { TabContainer, Tabs, Tab } from './NftBridge.styled';
import proton, { TeleportOutReqs } from '../../services/proton-rpc';
import { getDepositList } from '../../services/ethereum';
import { claimNfts } from '../../services/ethereum';
import { shortenAddress } from '../../utils';
import Button from '../Button';
import Spinner from '../Spinner';

enum TABS {
  OUT_REQS = 'outreqs',
  MINTED = 'minted',
  DEPOSIT_LIST = 'depositList'
}

interface TrackingProps {
  // fetchEthAssets: () => void
};

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
      // props.fetchEthAssets();
      // Refresh deposit list
    } catch (err) {
      addToast('Claim failed.', { appearance: 'error', autoDismiss: true });
      setIsLoading(false);
      console.log("claim error", err);
    }
  }

  return (
    <TabContainer>
      <Tabs>
        <Tab
          selected={selectedTab == TABS.DEPOSIT_LIST}
          onClick={() => setSelectedTab(TABS.DEPOSIT_LIST)}
        >
          DEPOSIT LIST
        </Tab>
      </Tabs>
      
      {isLoading && <Spinner>
      </Spinner>}
      {/* deposit list table */}
      {!isLoading && selectedTab === TABS.DEPOSIT_LIST &&
      <table>
        <thead style={{color: '#4710a3'}}>
          <tr>
            <td style={{padding: 15}}>#</td>
            <td style={{padding: 15}}>OWNER</td>
            <td style={{padding: 15}}>COLLECTION</td>
            <td style={{padding: 15}}>TOKEN ID</td>
            <td style={{padding: 15}}>ACTION</td>
          </tr>
        </thead>
        <tbody>
          {depositList.length > 0 && depositList.map((el, idx) => (
            <tr key={idx} style={{textAlign: 'center', color: '#6a6a6a'}}>
              <td style={{padding: 15}}>{idx + 1}</td>
              <td style={{padding: 15}}>{shortenAddress(el.owner)}</td>
              <td style={{padding: 15}}>{shortenAddress(el.collection)}</td>
              <td style={{padding: 15}}>{el.tokenId.toHexString().length > 15 ? shortenAddress(el.tokenId.toHexString()) : el.tokenId.toHexString()}</td>
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
    </TabContainer>
  )
}
