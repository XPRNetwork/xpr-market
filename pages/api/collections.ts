import { NextApiResponse } from 'next';
import withCache, { MyAssetRequest } from '../../utils/withCache';
import {
  collectionsApiService,
  Collection,
  SearchCollection,
} from '../../services/collections';

const handler = async (
  req: MyAssetRequest,
  res: NextApiResponse
): Promise<void> => {
  const { method, body } = req;
  switch (method) {
    case 'POST': {
      try {
        const newCollection = body as SearchCollection;
        if (!newCollection.name) {
          throw new Error(
            'Unable to update cache. Collection must have a valid name.'
          );
        }

        req.collectionSearchCache.set(newCollection.name, newCollection);
        res.status(200).json({ success: true, message: newCollection });
      } catch (e) {
        res.status(500).json({
          success: false,
          message:
            e.message ||
            'Unable to update cache. Collection must have a valid name.',
        });
      }
      break;
    }
    case 'PUT':
      break;
    case 'PATCH':
      break;
    default: {
      try {
        if (req.collectionSearchCache.length) {
          const cachedCollections = req.collectionSearchCache.getAllValues();
          res.status(200).send({ success: true, message: cachedCollections });
          return;
        }

        const limit = 100;
        let collections: Collection[] = [];
        let hasResults = true;
        let page = 1;

        while (hasResults) {
          const result = await collectionsApiService.getAll({
            limit,
            page,
          });

          if (!result.success) {
            throw new Error((result.message as unknown) as string);
          }

          if (result.data.length < limit) {
            hasResults = false;
          }

          collections = collections.concat(result.data);
          page += 1;
        }

        const collectionsByName = {};
        for (const collection of collections) {
          collectionsByName[collection.collection_name] = {
            name: collection.collection_name,
            displayName: collection.name,
            img: collection.img,
          };
        }

        for (const name in collectionsByName) {
          req.collectionSearchCache.set(name, collectionsByName[name]);
        }

        res
          .status(200)
          .send({ success: true, message: Object.values(collectionsByName) });
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
