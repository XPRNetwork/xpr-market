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

export type SearchTemplate = {
  author: string;
  collection: string;
  contract: string;
  created: string;
  id: string;
  is_burnable: boolean;
  is_transferable: true;
  issued_supply: string;
  max_supply: string;
  name: string;
  img?: string;
  video?: string;
  audio?: string;
  model?: string;
  stage?: string;
  skybox?: string;
};
