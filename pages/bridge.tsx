import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PageLayout from '../components/PageLayout';
import ErrorComponent from '../components/Error';
import LoadingPage from '../components/LoadingPage';
import NftBridge from '../components/NftBridge';
import {
  MODAL_TYPES,
  useAuthContext,
  useBlacklistContext,
} from '../components/Provider';
import proton from '../services/proton-rpc';

const Bridge = (): JSX.Element => {
  const { currentUser, isLoadingUser } = useAuthContext();

  return (
    <PageLayout title="Bridge">
      <NftBridge />
    </PageLayout>
  );
};

export default Bridge;
