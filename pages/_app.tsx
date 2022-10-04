import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import type { AppProps } from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import SimpleReactLightbox from 'simple-react-lightbox';
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core';
import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import '../styles/reset.css';
import '../styles/globals.css';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import {
  AuthProvider,
  ModalProvider,
  CreateAssetProvider,
  BlacklistProvider,
} from '../components/Provider';
import '../styles/customprogress.css';
import * as gtag from '../utils/gtag';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { ToastProvider } from 'react-toast-notifications';

const Web3ProviderNetwork =
  typeof window !== 'undefined' && createWeb3ReactRoot('NETWORK');

const getLibrary = (provider: ExternalProvider) => {
  const library = new Web3Provider(provider);
  library.pollingInterval = 8000;
  return library;
};

NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 800,
  showSpinner: false,
});

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const start = () => NProgress.start();
  const end = (url) => {
    NProgress.done();
    gtag.pageview(url);
  };

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const axe = require('@axe-core/react');
      axe(React, ReactDOM, 1000);
    }
  }, []);

  useEffect(() => {
    Router.events.on('routeChangeStart', start);
    Router.events.on('routeChangeComplete', end);
    Router.events.on('routeChangeError', end);
    return () => {
      Router.events.off('routeChangeStart', start);
      Router.events.off('routeChangeComplete', end);
      Router.events.off('routeChangeError', end);
    };
  }, []);

  return (
    <SimpleReactLightbox>
      <ToastProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
          {typeof window !== 'undefined' ? (
            <Web3ProviderNetwork getLibrary={getLibrary}>
              <ModalProvider>
                <AuthProvider>
                  <BlacklistProvider>
                    <CreateAssetProvider>
                      <NavBar />
                      <Component {...pageProps} />
                      <Footer />
                    </CreateAssetProvider>
                  </BlacklistProvider>
                </AuthProvider>
              </ModalProvider>
            </Web3ProviderNetwork>
          ) : (
            <ModalProvider>
              <AuthProvider>
                <BlacklistProvider>
                  <CreateAssetProvider>
                    <NavBar />
                    <Component {...pageProps} />
                    <Footer />
                  </CreateAssetProvider>
                </BlacklistProvider>
              </AuthProvider>
            </ModalProvider>
          )}
        </Web3ReactProvider>
      </ToastProvider>
    </SimpleReactLightbox>
  );
}

export default MyApp;
