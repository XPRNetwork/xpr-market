import { useRouter } from 'next/router';
import React from 'react';
import Button from '../Button';
import { EmptyContent, Title, Subtitle } from './EmptyUserContent.styled';

type Props = {
  subtitle: string;
  buttonTitle: string;
  link?: string;
};

const EmptyUserContent = ({
  subtitle,
  buttonTitle,
  link,
}: Props): JSX.Element => {
  const router = useRouter();

  return (
    <EmptyContent>
      <Title>No items found</Title>
      <Subtitle>{subtitle}</Subtitle>
      <Button margin="0" onClick={() => router.push(link)}>
        {buttonTitle}
      </Button>
    </EmptyContent>
  );
};

export default EmptyUserContent;
