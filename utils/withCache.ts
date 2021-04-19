import { NextApiRequest, NextApiResponse } from 'next';
import { CronJob } from 'cron';
import proton from '../services/proton-rpc';
import { SearchCollection } from '../services/collections';
import { Cache, profileCache, collectionSearchCache } from '../services/cache';

const cron = new CronJob(
  '00 00 00 * * *',
  // '* * * * * *', // Cron job every second for testing purposes
  async () => collectionSearchCache.clear(),
  null,
  false,
  'America/Los_Angeles'
);

export interface MyAssetRequest extends NextApiRequest {
  query: {
    accounts: string[];
  };
  profileCache: Cache;
  collectionSearchCache: Cache<SearchCollection>;
}

type Handler = (req: MyAssetRequest, res: NextApiResponse) => Promise<void>;

export const conditionallyUpdateCache = (
  account: string,
  cache: Cache
): Promise<string> =>
  new Promise((resolve) => {
    if (!cache.has(account)) {
      proton.getProfileImage({ account }).then((avatar) => {
        cache.set(account, avatar);
        resolve(avatar);
      });
    } else {
      resolve(account);
    }
  });

const withCache = (handler: Handler): Handler => {
  return async (req, res) => {
    cron.start();
    req.profileCache = profileCache;
    req.collectionSearchCache = collectionSearchCache;
    return handler(req, res);
  };
};

export default withCache;
