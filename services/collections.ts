import { getFromApi } from '../utils/browser-fetch';

export interface Collection {
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
  order?: number;
  sales?: string;
  volume?: string;
  data?: {
    img?: string;
    name?: string;
    description?: string;
  };
}

export const emptyCollection: Collection = {
  author: '',
  collection_name: '',
  name: '',
  img: '',
  allow_notify: false,
  authorized_accounts: [],
  notify_accounts: [],
  market_fee: 0,
  created_at_block: '',
  created_at_time: '',
  data: {
    img: '',
    name: '',
    description: '',
  },
};

export const getCollection = async (
  collectionName: string
): Promise<Collection> => {
  try {
    const result = await getFromApi<Collection>(
      `${process.env.NEXT_PUBLIC_NFT_ENDPOINT}/atomicassets/v1/collections/${collectionName}`
    );

    if (!result.success) {
      throw new Error((result.message as unknown) as string);
    }
    return result.data;
  } catch (e) {
    throw new Error(e);
  }
};

export const getAuthorsCollections = async (
  author: string
): Promise<Collection[]> => {
  try {
    const result = await getFromApi<Collection[]>(
      `${process.env.NEXT_PUBLIC_NFT_ENDPOINT}/atomicassets/v1/collections?author=${author}`
    );

    if (!result.success) {
      throw new Error((result.message as unknown) as string);
    }
    return result.data;
  } catch (e) {
    throw new Error(e);
  }
};
