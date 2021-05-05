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
        const result = await fetch(
          `https://api-dev.protonchain.com/v1/chain/market/search?q=${query}`
        )
          .then((res) => {
            if (res.ok) {
              return res.json();
            } else {
              throw new Error('Error retrieving search results');
            }
          })
          .then((res) => res);
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
