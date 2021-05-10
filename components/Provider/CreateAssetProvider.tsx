import { createContext, useState, useContext, useMemo, useEffect } from 'react';
import protonMarketIDB, {
  CachedAssets,
  CachedAsset,
} from '../../services/indexed-db';

const emptyCachedAsset = {
  ipfsHash: '',
  file: undefined,
};

interface CreateAssetContext {
  cachedNewlyCreatedAssets: CachedAssets;
  updateCachedNewlyCreatedAssets: (asset: CachedAsset) => void;
}

interface Props {
  children: JSX.Element | JSX.Element[];
}

const CreateAssetContext = createContext<CreateAssetContext>({
  cachedNewlyCreatedAssets: {},
  updateCachedNewlyCreatedAssets: () => {},
});

export const useCreateAssetContext = (): CreateAssetContext => {
  const context = useContext(CreateAssetContext);
  return context;
};

export const CreateAssetProvider = ({ children }: Props): JSX.Element => {
  const [
    cachedNewlyCreatedAssets,
    setCachedNewlyCreatedAssets,
  ] = useState<CachedAssets>({});
  const [assetToAddToIDB, setAssetToAddToIDB] = useState<CachedAsset>(
    emptyCachedAsset
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      protonMarketIDB.getAllAssets(setCachedNewlyCreatedAssets);
    }

    return () => {
      if (typeof window !== 'undefined') {
        protonMarketIDB.removeOldAssets();
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { ipfsHash, file } = assetToAddToIDB;
      if (ipfsHash && file) {
        protonMarketIDB.addAsset({ ipfsHash, file });
        setAssetToAddToIDB(emptyCachedAsset);
      }
    }
  }, [assetToAddToIDB]);

  const updateCachedNewlyCreatedAssets = async ({
    ipfsHash,
    file,
  }: CachedAsset) => {
    setCachedNewlyCreatedAssets((prevAssets) => ({
      ...prevAssets,
      [ipfsHash]: file,
    }));

    setAssetToAddToIDB({ ipfsHash, file });
  };

  const value = useMemo<CreateAssetContext>(
    () => ({
      updateCachedNewlyCreatedAssets,
      cachedNewlyCreatedAssets,
    }),
    [cachedNewlyCreatedAssets]
  );

  return (
    <CreateAssetContext.Provider value={value}>
      {children}
    </CreateAssetContext.Provider>
  );
};
