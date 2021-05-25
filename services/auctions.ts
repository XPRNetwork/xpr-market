import { toQueryString } from '../utils';
import { getFromApi } from '../utils/browser-fetch';

interface Auction {
  
}

/**
 * Get all auctions a user has created
 * @param seller The account name of the seller of the auction assets
 * @returns {any[]}
 */

export const getAllAuctionsBySeller = async (
  seller: string
): Promise<any[]> => {
  try {
    const limit = 100;
    let auctions = [];
    let hasResults = true;
    let page = 1;

    while (hasResults) {
      const queryObject = {
        seller,
        page,
        limit,
      };
      const queryParams = toQueryString(queryObject);
      const result = await getFromApi<any[]>(
        `${process.env.NEXT_PUBLIC_NFT_ENDPOINT}/atomicmarket/v1/auctions?${queryParams}`
      );

      if (!result.success) {
        throw new Error((result.message as unknown) as string);
      }

      if (result.data.length < limit) {
        hasResults = false;
      }

      auctions = auctions.concat(result.data);
      page += 1;
    }

    return auctions;
  } catch (e) {
    throw new Error(e);
  }
};
