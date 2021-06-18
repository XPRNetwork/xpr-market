export type SearchAuthor = {
  acc: string;
  avatar?: string;
  date: number;
  id: string;
  name?: string;
  verified: boolean;
  verifiedon: number;
  verifier: string;
};

export type SearchCollection = {
  author: string;
  authorized_accounts: string[];
  collection_name: string;
  contract: string;
  created: string;
  img?: string | null;
  name?: string;
  description?: string;
};

export type SearchResultsByType<T> = {
  contents?: T[];
  numberOfElements?: number;
  totalPages?: number;
  pageSize?: number;
  page?: number;
};
