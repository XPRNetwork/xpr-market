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
        const hashQueryParam = hash ? `?ipfsHash=${hash}` : '';
        const rawResult = await fetch(
          `${process.env.BACKEND_ENDPOINT}/market/cached-files${hashQueryParam}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.PROTON_MARKET_JWT_SECRET}`,
            },
          }
        );
        const result = await rawResult.json();

        const files = {};
        for (const file of result.contents) {
          const { ipfs_hash, data } = file;
          files[ipfs_hash] =
            'data:image/jpeg;base64,' +
            Buffer.from(data.data).toString('base64');
        }

        res.status(200).send({ success: true, message: files });
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
