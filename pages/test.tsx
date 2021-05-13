import PageLayout from '../components/PageLayout';
import FilterDropdown from '../components/FilterDropdown';
import Grid from '../components/Grid';
import { CARD_RENDER_TYPES } from '../utils/constants';

const Test = (): JSX.Element => {
  const cards = [
    {
      author: 'protonsea',
      authorized_accounts: ['protonsea'],
      collection_name: 'litemonsters',
      contract: 'atomicassets',
      created: '1617056132500',
      img: 'QmRZ2eYNStoXGVXhzHjPk9CRxyUFPJsJKwG1xQzJBPb3BH',
      name: 'Lite Monsters',
      description: '',
    },
    {
      author: 'protonsea',
      authorized_accounts: ['protonsea'],
      collection_name: 'litemonsters',
      contract: 'atomicassets',
      created: '1617056132500',
      img: 'QmRZ2eYNStoXGVXhzHjPk9CRxyUFPJsJKwG1xQzJBPb3BH',
      name: 'Lite Monsters',
      description: '',
    },
    {
      author: 'protonsea',
      authorized_accounts: ['protonsea'],
      collection_name: 'litemonsters',
      contract: 'atomicassets',
      created: '1617056132500',
      img: 'QmRZ2eYNStoXGVXhzHjPk9CRxyUFPJsJKwG1xQzJBPb3BH',
      name: 'Lite Monsters',
      description: '',
    },
    {
      author: 'protonsea',
      authorized_accounts: ['protonsea'],
      collection_name: 'litemonsters',
      contract: 'atomicassets',
      created: '1617056132500',
      img: 'QmRZ2eYNStoXGVXhzHjPk9CRxyUFPJsJKwG1xQzJBPb3BH',
      name: 'Lite Monsters',
      description: '',
    },
  ];

  return (
    <PageLayout title="Test">
      <br />
      <br />
      <br />
      <FilterDropdown />
      <Grid items={cards} type={CARD_RENDER_TYPES.COLLECTION} />
    </PageLayout>
  );
};

export default Test;
