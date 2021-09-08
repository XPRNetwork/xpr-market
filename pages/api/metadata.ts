import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const {
    method,
    query: { hash },
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
        // hash should not contain slashes
        if (hash.indexOf('/') !== -1) {
          return res.send({
            success: true,
            message: {},
          });
        }

        const rawResult = await fetch(
          `${process.env.BACKEND_ENDPOINT}/market/files/${hash}/metadata`,
          {
            headers: {
              Authorization: `Bearer ${process.env.PROTON_MARKET_JWT_SECRET}`,
            },
          }
        );
        const result = await rawResult.json();
        if (result.message === 'Resource not found') {
          return res.send({
            success: true,
            message: {},
          });
        }
        if (result.error) throw new Error(result.message);
        res.status(200).send({ success: true, message: result });
      } catch (e) {
        res.send({
          success: false,
          message: e.message || 'Error retrieving cached files',
        });
      }
      break;
    }
  }
};

export default handler;
