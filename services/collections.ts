import { getFromApi } from '../utils/browser-fetch';

export type Collection = {
  author: string;
  collection_name: string;
  name?: string | null;
  img?: string | null;
  allow_notify?: boolean;
  authorized_accounts?: string[];
  notify_accounts?: string[] | [];
  market_fee?: number;
  created_at_block?: string;
  created_at_time?: string;
};

export type CollectionsByName = {
  [name: string]: {
    name: string;
    img: string | null;
  };
};

/**
 * Get all collection names
 * Mostly fetching collection names for the marketplace search
 * @return {CollectionsByName}     Returns indexable object of collection names
 */

export const getAllCollectionNames = async (): Promise<CollectionsByName> => {
  try {
    const limit = 100;
    let collections = [];
    let hasResults = true;
    let page = 1;

    while (hasResults) {
      const result = await getFromApi<Collection[]>(
        `${process.env.NEXT_PUBLIC_NFT_ENDPOINT}/atomicassets/v1/collections?limit=${limit}&page=${page}`
      );

      if (!result.success) {
        throw new Error((result.message as unknown) as string);
      }

      if (result.data.length < limit) {
        hasResults = false;
      }

      collections = collections.concat(result.data);
      page += 1;
    }

    const collectionNames = {};
    for (const collection of collections) {
      collectionNames[collection.collection_name] = {
        name: collection.collection_name,
        img: collection.img,
      };
    }

    return collectionNames;
  } catch (e) {
    throw new Error(e);
  }
};
