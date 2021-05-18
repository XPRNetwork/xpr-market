import PageLayout from '../components/PageLayout';
import Grid from '../components/Grid';
import { CARD_RENDER_TYPES } from '../utils/constants';

const Test = (): JSX.Element => {
  const cardsCreator = [
    {
      acc: 'morpheus',
      avatar:
        'data:image/jpeg;base64,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',
      date: 1615842666,
      id: 'morpheus',
      name: 'Morpheus',
      verified: false,
      verifiedon: 0,
      verifier: '',
    },
    {
      acc: 'morpheus',
      avatar: '',
      date: 1615842666,
      id: 'morpheus',
      name: 'Morpheus',
      verified: false,
      verifiedon: 0,
      verifier: '',
    },
    {
      acc: 'morpheus',
      avatar: '',
      date: 1615842666,
      id: 'morpheus',
      name: 'Morpheus',
      verified: false,
      verifiedon: 0,
      verifier: '',
    },
    {
      acc: 'morpheus',
      avatar: '',
      date: 1615842666,
      id: 'morpheus',
      name: 'Morpheus',
      verified: false,
      verifiedon: 0,
      verifier: '',
    },
  ];

  const cardsCollection = [
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
      img: '',
      name: 'Lite Monsters',
      description: '',
    },
  ];

  return (
    <PageLayout title="Test">
      <br />
      <br />
      <br />
      <Grid items={cardsCollection} type={CARD_RENDER_TYPES.COLLECTION} />
      <br />
      <br />
      <Grid items={cardsCreator} type={CARD_RENDER_TYPES.CREATOR} />
    </PageLayout>
  );
};

export default Test;
