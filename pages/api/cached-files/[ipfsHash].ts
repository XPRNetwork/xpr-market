import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const {
    method,
    query: { ipfsHash },
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
          `${process.env.BACKEND_ENDPOINT}/market/cached-files/${ipfsHash}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.PROTON_MARKET_JWT_SECRET}`,
            },
          }
        );
        const result = await rawResult.json();

        if (result.error) {
          throw new Error(result.message || result.error);
        }

        const { data } = result;
        const base64 =
          'data:image/jpeg;base64,' + Buffer.from(data.data).toString('base64');

        res.status(200).send({ success: true, message: { ipfsHash: base64 } });
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
