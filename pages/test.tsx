import PageLayout from '../components/PageLayout';
import TemplateCard from '../components/TemplateCard';

const Test = (): JSX.Element => {
  return (
    <PageLayout title="Test">
      <div
        style={{
          marginTop: '50px',
          display: 'inline-grid',
          gridColumnGap: '16px',
          gridRowGap: '48px',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        }}>
        <TemplateCard hasMultiple />
        <TemplateCard hasMultiple />
        <TemplateCard />
        <TemplateCard />
      </div>
    </PageLayout>
  );
};

export default Test;
