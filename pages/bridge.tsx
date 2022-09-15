import { useEffect } from 'react';
import { useWeb3React } from "@web3-react/core";
import PageLayout from '../components/PageLayout';
import NftBridge from '../components/NftBridge';
import { connectors } from '../services/ethereum';

const Bridge = (): JSX.Element => {
  const { activate } = useWeb3React();

  useEffect(() => {
    const provider = window.localStorage.getItem("provider");
    if (provider) activate(connectors[provider]);
  }, []);

  return (
    <PageLayout title="Bridge">
      <NftBridge />
    </PageLayout>
  );
};

export default Bridge;
