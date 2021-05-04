import { useState, useEffect } from 'react';
import {
  Container,
  Section,
  Card,
  Text,
  Subtext,
  Icon,
} from './HomepageStatistics.styled';
import { Image } from '../../styles/index.styled';
import { getStatistics } from '../../services/statistics';
import { formatThousands } from '../../utils';

type Props = {
  text: string;
  subtext: string;
  imgSrc: string;
};

const StatisticCard = ({ text, subtext, imgSrc }: Props): JSX.Element => (
  <Card>
    <Icon>
      <Image width="32px" height="auto" alt={subtext} src={imgSrc} />
    </Icon>
    <Section>
      <Text>{text}</Text>
      <Subtext>{subtext}</Subtext>
    </Section>
  </Card>
);

const HomepageStatistics = (): JSX.Element => {
  const [nftsCreated, setNftsCreated] = useState<string>('16156137');
  const [transactions, setTransactions] = useState<string>('125580');
  const [totalSales, setTotalSales] = useState<string>('7091022');
  const [salesToday, setSalesToday] = useState<string>('51899');

  useEffect(() => {
    (async () => {
      try {
        const stats = await getStatistics();
        setNftsCreated(stats.nftsCreated);
        setTransactions(stats.transactions);
        setTotalSales(stats.totalSales);
        setSalesToday(stats.salesToday);
      } catch (err) {
        console.warn(err);
      }
    })();
  }, []);

  const stats = [
    {
      text: formatThousands(nftsCreated),
      subtext: "NFT'S CREATED",
      imgSrc: '/nfts-created.svg',
    },
    {
      text: formatThousands(transactions),
      subtext: 'TRANSACTIONS',
      imgSrc: '/transactions.svg',
    },
    {
      text: `$${formatThousands(totalSales)}`,
      subtext: 'TOTAL SALES',
      imgSrc: '/total-sales.svg',
    },
    {
      text: `$${formatThousands(salesToday)}`,
      subtext: 'SALES TODAY',
      imgSrc: '/sales-today.svg',
    },
  ];

  return (
    <Container>
      {stats.map((stat) => (
        <StatisticCard {...stat} key={stat.subtext} />
      ))}
    </Container>
  );
};

export default HomepageStatistics;
