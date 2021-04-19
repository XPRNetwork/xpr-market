import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Button from '../Button';
import { useWindowSize } from '../../hooks';
import {
  Container,
  Content,
  Title,
  SubTitle,
  ImageContainer,
  ButtonWrapper,
} from './ExploreCard.styled';

const ExploreCard = (): JSX.Element => {
  const router = useRouter();
  const { isMobile } = useWindowSize();
  const [isFullWidth, setIsFullWidth] = useState<boolean>(true);

  useEffect(() => {
    setIsFullWidth(isMobile);
  }, [isMobile]);

  return (
    <Container>
      <Content>
        <Title>Start creating and selling your own NFTs!</Title>
        <SubTitle>
          The best way to monetize your talent. Free to get started.
        </SubTitle>
        <ButtonWrapper>
          <Button
            fullWidth={isFullWidth}
            margin="0"
            smallSize={isMobile}
            onClick={() => router.push('/create')}>
            Get Started
          </Button>
        </ButtonWrapper>
      </Content>
      <ImageContainer>
        {isMobile ? (
          <Image
            priority
            layout="intrinsic"
            width="875px"
            height="430px"
            alt="ExploreMobile"
            src="/ExploreMobile.png"
          />
        ) : (
          <Image
            priority
            layout="intrinsic"
            width="672px"
            height="320px"
            alt="Explore"
            src="/Explore.png"
          />
        )}
      </ImageContainer>
    </Container>
  );
};

export default ExploreCard;
