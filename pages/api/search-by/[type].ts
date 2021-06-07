import { NextApiRequest, NextApiResponse } from 'next';
import { PAGINATION_LIMIT } from '../../../utils/constants';
import { toQueryString } from '../../../utils';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const {
    method,
    query: { type, query, page, pageSize, sortKey, sortOrder },
  } = req;
  switch (method) {
    case 'POST':
      break;
    case 'PUT':
      break;
    case 'PATCH':
      break;
    default: {
      try {
        const queryParams: {
          q: string;
          page: string;
          pageSize: string;
          sortKey?: string;
          sortOrder?: string;
        } = {
          q: query as string,
          page: (page as string) || '1',
          pageSize: (pageSize as string) || PAGINATION_LIMIT.toString(),
        };

        if (sortKey) {
          queryParams.sortKey = sortKey as string;
          queryParams.sortOrder = (sortOrder as string) || 'desc';
        }
        const queryString = toQueryString(queryParams);
        const rawResult = await fetch(
          `${process.env.BACKEND_ENDPOINT}/market/search/${type}?${queryString}`
        );
        const result = await rawResult.json();

        res.status(200).send({ success: true, message: result });
      } catch (e) {
        res.status(500).send({
          success: false,
          message: e.message || 'Error retrieving search results',
        });
      }
      break;
    }
  }
};

export default handler;
