import { NextApiResponse } from 'next';
import proton from '../../services/proton-rpc';
import withCache, { MyAssetRequest } from '../../utils/withCache';

const handler = async (
  req: MyAssetRequest,
  res: NextApiResponse
): Promise<void> => {
  const {
    method,
    query: { accounts },
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
        const chainAccounts =
          typeof accounts === 'string' ? [accounts] : [...new Set(accounts)];

        const avatarsByChainAccount = {};
        const promises = chainAccounts.map(async (account) => {
          if (!avatarsByChainAccount[account]) {
            const avatar = await proton.getProfileImage({ account });
            avatarsByChainAccount[account] = avatar;
          }
        });
        await Promise.all(promises);

        res.status(200).send({ success: true, message: avatarsByChainAccount });
      } catch (e) {
        res.status(500).send({
          success: false,
          message: e.message || 'Error retrieving profile avatars',
        });
      }
      break;
    }
  }
};

export default withCache(handler);
