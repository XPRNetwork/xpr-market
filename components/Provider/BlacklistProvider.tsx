import {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  FC,
} from 'react';
import { getFromApi } from '../../utils/browser-fetch';
import { useRouter } from 'next/router';

interface BlacklistResponse {
  authors: {
    [author: string]: boolean;
  };
  templates: {
    [template: string]: boolean;
  };
  collections: {
    [collection: string]: boolean;
  };
}

interface Blacklist {
  authorsBlacklist: {
    [author: string]: boolean;
  };
  templatesBlacklist: {
    [template: string]: boolean;
  };
  collectionsBlacklist: {
    [collection: string]: boolean;
  };
}

interface BlacklistContext extends Blacklist {
  isLoadingBlacklist: boolean;
}

interface Props {
  children: JSX.Element | JSX.Element[];
}

const BlacklistContext = createContext<BlacklistContext>({
  authorsBlacklist: {},
  templatesBlacklist: {},
  collectionsBlacklist: {},
  isLoadingBlacklist: true,
});

export const useBlacklistContext = (): BlacklistContext => {
  const context = useContext(BlacklistContext);
  return context;
};

export const BlacklistProvider: FC<Props> = ({ children }) => {
  const [isLoadingBlacklist, setisLoadingBlacklist] = useState<boolean>(true);
  const [templatesBlacklist, setTemplatesBlacklist] = useState<{
    [template: string]: boolean;
  }>({});
  const [authorsBlacklist, setAuthorsBlacklist] = useState<{
    [author: string]: boolean;
  }>({});
  const [collectionsBlacklist, setCollectionsBlacklist] = useState<{
    [collection: string]: boolean;
  }>({});
  const { asPath: routerPath } = useRouter();

  const getList = async () => {
    setisLoadingBlacklist(true);
    const { success, message } = await getFromApi('/api/blacklist');

    if (!success) {
      // Will be caught by Sentry
      setisLoadingBlacklist(false);
      throw new Error(`Failed to grab blacklist: ${message}`);
    }
    const blacklist = message as BlacklistResponse;

    setTemplatesBlacklist(blacklist.templates || {});
    setAuthorsBlacklist(blacklist.authors || {});
    setCollectionsBlacklist(blacklist.collections || {});
    setisLoadingBlacklist(false);
  };

  useEffect(() => {
    getList();
  }, []);

  useEffect(() => {
    if (routerPath.includes('/search')) {
      getList();
    }
  }, [routerPath]);

  const value = useMemo<BlacklistContext>(
    () => ({
      authorsBlacklist,
      collectionsBlacklist,
      templatesBlacklist,
      isLoadingBlacklist,
    }),
    [
      authorsBlacklist,
      collectionsBlacklist,
      templatesBlacklist,
      isLoadingBlacklist,
    ]
  );

  return (
    <BlacklistContext.Provider value={value}>
      {children}
    </BlacklistContext.Provider>
  );
};
