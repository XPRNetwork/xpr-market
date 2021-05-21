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

interface Blacklist {
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

interface BlacklistContext extends Blacklist {
  isLoadingBlacklist: boolean;
}

interface Props {
  children: JSX.Element | JSX.Element[];
}

const BlacklistContext = createContext<BlacklistContext>({
  authors: null,
  templates: null,
  collections: null,
  isLoadingBlacklist: true,
});

export const useBlacklistContext = (): BlacklistContext => {
  const context = useContext(BlacklistContext);
  return context;
};

export const BlacklistProvider: FC<Props> = ({ children }) => {
  const [isLoadingBlacklist, setisLoadingBlacklist] = useState<boolean>(true);
  const [templates, setTemplates] = useState<{ [template: string]: boolean }>(
    null
  );
  const [authors, setAuthors] = useState<{ [author: string]: boolean }>(null);
  const [collections, setCollections] = useState<{
    [collection: string]: boolean;
  }>(null);
  const { asPath: routerPath } = useRouter();

  const getList = async () => {
    setisLoadingBlacklist(true);
    const { success, message } = await getFromApi('/api/blacklist');

    if (!success) {
      // Will be caught by Sentry
      setisLoadingBlacklist(false);
      throw new Error(`Failed to grab blacklist: ${message}`);
    }
    const blacklist = message as Blacklist;

    setTemplates(blacklist.templates);
    setAuthors(blacklist.authors);
    setCollections(blacklist.collections);
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
      authors,
      collections,
      templates,
      isLoadingBlacklist,
    }),
    [authors, collections, templates, isLoadingBlacklist]
  );

  return (
    <BlacklistContext.Provider value={value}>
      {children}
    </BlacklistContext.Provider>
  );
};
