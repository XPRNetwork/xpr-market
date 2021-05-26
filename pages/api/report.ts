import { NextApiResponse, NextApiRequest } from 'next';
import fetch from 'node-fetch';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { method, body } = req;
  switch (method) {
    case 'POST': {
      try {
        const resultRaw = await fetch(
          `${process.env.BACKEND_ENDPOINT}/market/reports`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.PROTON_MARKET_JWT_SECRET}`,
            },
            body: JSON.stringify(body),
          }
        );

        const result = await resultRaw.json();

        if (result.error) throw new Error(result.message || result.error);

        res.status(200).send({ success: true, message: result });
      } catch (e) {
        res.send({
          success: false,
          message: e.message || 'Error during report',
        });
      }
      break;
    }
    case 'PUT':
      break;
    case 'PATCH':
      break;
    default:
      break;
  }
};

export default handler;
