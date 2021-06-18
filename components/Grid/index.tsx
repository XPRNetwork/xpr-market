import { useRouter } from 'next/router';
import TemplateCard from '../TemplateCard';
import { useAuthContext } from '../Provider/AuthProvider';
import { Template } from '../../services/templates';
import { Container } from './Grid.styled';
import { CARD_RENDER_TYPES } from '../../utils/constants';
import CollectionCard from '../CollectionCreatorCard/CollectionCard';
import CreatorCard from '../CollectionCreatorCard/CreatorCard';
import { SearchCollection, SearchAuthor } from '../../services/search';
import SearchTemplateCard from '../SearchTemplateCard';

type Props = {
  isLoadingPrices: boolean;
  items: Template[] | (Template | SearchCollection | SearchAuthor)[];
  type: string;
};

const Grid = ({ isLoadingPrices, items, type }: Props): JSX.Element => {
  const router = useRouter();
  const { currentUser } = useAuthContext();
  const isUsersTemplates =
    currentUser && router.query.chainAccount === currentUser.actor;

  const getGridContent = () => {
    switch (type) {
      case CARD_RENDER_TYPES.TEMPLATE: {
        return items.map((template) => (
          <TemplateCard
            key={template.template_id}
            template={template}
            isUsersTemplates={isUsersTemplates}
            hasShimmer={isLoadingPrices}
          />
        ));
      }
      case CARD_RENDER_TYPES.SEARCH_TEMPLATE: {
        return items.map((template) => {
          return <SearchTemplateCard key={template.id} template={template} />;
        });
      }
      case CARD_RENDER_TYPES.COLLECTION: {
        return items.map((collection) => (
          <CollectionCard
            key={collection.collection_name}
            cardContent={collection}
          />
        ));
      }
      case CARD_RENDER_TYPES.CREATOR: {
        return items.map((creator) => (
          <CreatorCard key={creator.acc} cardContent={creator} />
        ));
      }
      default: {
        return <></>;
      }
    }
  };

  return <Container>{getGridContent()}</Container>;
};

Grid.defaultProps = {
  items: [],
  isLoadingPrices: false,
};

export default Grid;
