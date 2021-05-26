import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { method } = req;
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
          `${process.env.BACKEND_ENDPOINT}/market/blacklisted-entries`,
          {
            headers: {
              Authorization: `Bearer ${process.env.PROTON_MARKET_JWT_SECRET}`,
            },
          }
        );
        const result = await rawResult.json();
        res.status(200).send({ success: true, message: result });
      } catch (e) {
        res.send({
          success: false,
          message: e.message || 'Error retrieving blacklist',
        });
      }
      break;
    }
  }
};

export default handler;
