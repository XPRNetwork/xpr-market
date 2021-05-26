import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const {
    method,
    query: { query },
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
        const rawResult = await fetch(
          `${process.env.BACKEND_ENDPOINT}/chain/market/search?q=${query}`
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
