import { useRouter } from 'next/router';
import TemplateCard from '../TemplateCard';
import { useAuthContext } from '../Provider/AuthProvider';
import { Template } from '../../services/templates';
import { Container } from './Grid.styled';

type Props = {
  items: Template[];
};

const Grid = ({ items }: Props): JSX.Element => {
  const router = useRouter();
  const { currentUser } = useAuthContext();
  const isUsersTemplates =
    currentUser && router.query.chainAccount === currentUser.actor;

  return (
    <Container>
      {items.map(
        ({
          name,
          template_id,
          collection: { collection_name, img },
          immutable_data: { image },
          issued_supply,
          lowestPrice,
          totalAssets,
          assetsForSale,
        }) => {
          const redirectPath = isUsersTemplates
            ? `/my-templates/${template_id}`
            : `/${template_id}`;
          return (
            <TemplateCard
              key={template_id}
              collectionName={collection_name}
              templateName={name}
              editionSize={issued_supply}
              redirectPath={redirectPath}
              isUsersTemplates={isUsersTemplates}
              totalAssets={totalAssets}
              assetsForSale={assetsForSale}
              collectionImage={img}
              templateImage={image}
              price={lowestPrice}
            />
          );
        }
      )}
    </Container>
  );
};

export default Grid;
