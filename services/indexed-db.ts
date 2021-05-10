import { Dispatch, SetStateAction } from 'react';

export type CachedAssets = {
  [key: string]: File;
};

export type CachedAsset = { ipfsHash: string; file: File };

type TxResponse = IDBRequest | CachedAsset | IDBValidKey | void;

class ProtonMarketIDB {
  db: IDBDatabase;

  constructor() {
    if (typeof window !== 'undefined' && !this.db) {
      this.init();
    }
  }

  init = () => {
    if (!window.indexedDB) {
      console.error(
        "Your browser doesn't support a stable version of IndexedDB. Newly created NFTs will not load until they are 10 mins old."
      );
      return;
    }

    const request = window.indexedDB.open('ProtonMarketIDB', 1);

    request.onerror = (event) => {
      console.error('IndexedDB error: ' + event);
    };

    request.onsuccess = () => {
      this.db = request.result;
    };

    request.onupgradeneeded = () => {
      const db = request.result;
      const hasAssetsTable = db.objectStoreNames.contains('assets');

      if (!hasAssetsTable) {
        const assetsTable = db.createObjectStore('assets', {
          keyPath: 'ipfsHash',
        });
        assetsTable.createIndex('created_idx', 'created');
        this.db = db;
      }
    };
  };

  connectDatabaseAndTransact = (
    transactionCallback: (db: IDBDatabase) => TxResponse
  ): TxResponse => {
    const connection = window.indexedDB.open('ProtonMarketIDB', 1);

    connection.onerror = (event) => {
      console.error('IndexedDB error: ' + event);
    };

    connection.onsuccess = () => {
      const db = connection.result;
      transactionCallback(db);
    };
  };

  getAllAssets = (
    setCachedNewlyCreatedAssets: Dispatch<SetStateAction<CachedAssets>>
  ): TxResponse =>
    this.connectDatabaseAndTransact((db) => {
      const tx = db.transaction('assets').objectStore('assets').getAll();

      tx.onsuccess = () => {
        const assetsByIpfsHash = {};
        for (const asset of tx.result) {
          assetsByIpfsHash[asset.ipfsHash] = asset.file;
        }

        setCachedNewlyCreatedAssets((prevAssets) => ({
          ...prevAssets,
          ...assetsByIpfsHash,
        }));

        this.removeOldAssets();
      };
    });

  getAssetByIpfsHash = ({ ipfsHash }: { ipfsHash: string }): TxResponse =>
    this.connectDatabaseAndTransact((db) => {
      const tx = db.transaction('assets').objectStore('assets').get(ipfsHash);
      tx.onsuccess = () => tx.result;
    });

  addAsset = ({ ipfsHash, file }: CachedAsset): TxResponse =>
    this.connectDatabaseAndTransact((db) => {
      const asset = {
        ipfsHash,
        file,
        created: Date.now(),
        created_timestamp: new Date(),
      };

      const tx = db
        .transaction('assets', 'readwrite')
        .objectStore('assets')
        .add(asset);

      tx.onsuccess = () => tx.result;
    });

  removeOldAssets = (): TxResponse =>
    this.connectDatabaseAndTransact((db) => {
      const fifteenMinutesInMilliseconds = 15 * 60 * 1000;
      const last15Mins = Date.now() - fifteenMinutesInMilliseconds;

      const tx = db
        .transaction('assets')
        .objectStore('assets')
        .index('created_idx')
        .getAll(IDBKeyRange.upperBound(last15Mins, true));

      tx.onsuccess = () => {
        const deletionResults = {};
        for (const oldAsset of tx.result) {
          const id = oldAsset.ipfsHash;

          const deleteTx = db
            .transaction('assets', 'readwrite')
            .objectStore('assets')
            .delete(id);

          deleteTx.onsuccess = () => {
            deletionResults[id] = deleteTx.result;
          };
        }

        return deletionResults;
      };
    });
}

export default new ProtonMarketIDB();
