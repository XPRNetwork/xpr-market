import { useRouter } from 'next/router';
import TemplateCard from '../TemplateCard';
import { useAuthContext } from '../Provider/AuthProvider';
import { Template } from '../../services/templates';
import { Container } from './Grid.styled';
import { CARD_RENDER_TYPES } from '../../utils/constants';
import CollectionCard from '../CollectionCreatorCard/CollectionCard';
import CreatorCard from '../CollectionCreatorCard/CreatorCard';
import { SearchCollection, SearchAuthor } from '../../services/search';

type Props = {
  isLoadingPrices: boolean;
  items: Template[] | SearchCollection[] | SearchAuthor[];
  type: string;
};

const Grid = ({ isLoadingPrices, items, type }: Props): JSX.Element => {
  const router = useRouter();
  const { currentUser } = useAuthContext();
  const isUsersTemplates =
    currentUser && router.query.chainAccount === currentUser.actor;

  const getGridContent = () => {
    switch (type) {
      case CARD_RENDER_TYPES.TEMPLATE:
        {
          return items.map((template) => {
            const {
              template_id,
              collection: { collection_name },
              issued_supply,
              totalAssets,
            } = template;
            const redirectPath = isUsersTemplates
              ? `/details/${currentUser.actor}/${collection_name}/${template_id}`
              : `/${collection_name}/${template_id}`;
            const ownerHasMultiple =
              totalAssets &&
              !isNaN(parseInt(totalAssets)) &&
              parseInt(totalAssets) > 1;
            const hasMultiple =
              !totalAssets && !isNaN(parseInt(issued_supply))
                ? parseInt(issued_supply) > 1
                : false;
            return (
              <TemplateCard
                key={template_id}
                template={template}
                isUsersTemplates={isUsersTemplates}
                redirectPath={redirectPath}
                hasShimmer={isLoadingPrices}
                hasMultiple={ownerHasMultiple || hasMultiple}
              />
            );
          });
        }
        break;
      case CARD_RENDER_TYPES.COLLECTION:
        {
          return items.map((collection) => (
            <CollectionCard
              key={collection.collection_name}
              cardContent={collection}
            />
          ));
        }
        break;
      case CARD_RENDER_TYPES.CREATOR:
        {
          return items.map((creator) => (
            <CreatorCard key={creator.acc} cardContent={creator} />
          ));
        }
        break;
      // case default: {
      //   return (<></>);
      // }
    }
  };

  return <Container>{getGridContent()}</Container>;
};

Grid.defaultProps = {
  items: [],
  isLoadingPrices: false,
};

export default Grid;
