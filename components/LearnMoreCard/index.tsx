import React, { useEffect, useState } from 'react';
import { Image } from '../../styles/index.styled';
import { useNavigatorUserAgent, useWindowSize } from '../../hooks';
import {
  Container,
  Card,
  CardTitle,
  CardParagraph,
  Content,
  Title,
  SubTitle,
  Title2,
  ImageContainer,
  StandardLink,
  BannerText,
  BulletPoint,
  TickList,
  Question,
  Answer,
  FeatureBox,
  FeatureBoxTitle,
  FeatureBoxBullet,
  FeatureBoxText,
  Collapse,
} from './LearnMoreCard.styled';
import { Container as ContainerGrid, Row, Col } from 'react-grid-system';

const LearnMoreCard = (): JSX.Element => {
  const [imgSrc, setImgSrc] = useState<string>('');
  const { isDesktop } = useNavigatorUserAgent();
  const { isMobile } = useWindowSize();

  const [collapsible, setCollapisble] = useState({
    sectionOne: false,
    sectionTwo: false,
    sectionThree: false,
  });

  const collapseToggle = function (section) {
    if (section == 1) {
      setCollapisble({
        ...collapsible,
        sectionOne: collapsible.sectionOne ? false : true,
      });
    } else if (section == 2) {
      setCollapisble({
        ...collapsible,
        sectionTwo: collapsible.sectionTwo ? false : true,
      });
    } else if (section == 3) {
      setCollapisble({
        ...collapsible,
        sectionThree: collapsible.sectionThree ? false : true,
      });
    }
  };

  useEffect(() => {
    if (isDesktop !== null && (!isDesktop || isMobile)) {
      setImgSrc('/ExploreMobile.png');
    } else {
      setImgSrc('/LearnMore.png');
    }
  }, [isDesktop, isMobile]);

  return (
    <>
      <Container>
        <Content>
          <Title>Welcome to Proton Market</Title>
          <SubTitle>
            The easiest, most affordable, and most straight-forward way to
            create, sell, buy, and trade NFTs is ready for you.
          </SubTitle>
          <Title2>Why launch your NFTs on Proton Market?</Title2>

          <TickList>
            <BulletPoint>
              No gas fees! There are no gas fees for users to purchase NFTs on
              the Proton blockchain.
            </BulletPoint>
            <BulletPoint>
              Low fees to mint NFTs, with mint prices hovering around just a few
              cents and all prices marked in XUSDC.
            </BulletPoint>
            <BulletPoint>
              Instant transactions mean no wait times - so your buyers can own
              their new purchases immediately.
            </BulletPoint>
            <BulletPoint>
              Low barriers to entry. Buyers shouldn’t have to pay $40-$200 in
              fees just to own an NFT. With Proton Market, your buyers pay fewer
              fees than anywhere else, meaning you take home more profit.
            </BulletPoint>
            <BulletPoint style={{ marginBottom: 38 }}>
              Royalties! Earn passive income every time one of your creations is
              resold, without you needing to monitor future sales yourself.
            </BulletPoint>
          </TickList>

          <BannerText>
            To learn more about Proton Market, check out our quick guide below.
          </BannerText>
        </Content>
        <ImageContainer>
          {imgSrc ? (
            <Image
              width="100%"
              height="100%"
              objectFit="cover"
              alt="Explore"
              src={imgSrc}
            />
          ) : null}
        </ImageContainer>
      </Container>

      <Card>
        <CardTitle
          onClick={() => {
            collapseToggle(1);
          }}>
          How to get started on Proton Market
        </CardTitle>
        <Collapse
          style={{
            opacity: collapsible.sectionOne ? 100 : 0,
            visibility: collapsible.sectionOne ? 'visible' : 'hidden',
          }}>
          <div
            style={{
              display: collapsible.sectionOne ? 'block' : 'none',
            }}>
            <CardParagraph>
              Our ground-breaking NFT marketplace has been one of the
              community’s favorite projects to come from the Proton team in
              recent months. Proton Market, the world’s easiest to use NFT
              platform, has allowed people to upload an NFT with just a few
              clicks, buy and sell NFTs for just a few cents in fees, and earn
              royalties on resales of their creations passively and stress-free.
            </CardParagraph>
            <CardParagraph>Here’s how to get started:</CardParagraph>
            <CardParagraph>
              Step 1 - Create a{' '}
              <StandardLink
                target="_BLANK"
                rel="noreferrer"
                href="https://www.protonchain.com/wallet">
                Webauth.com account
              </StandardLink>{' '}
              for free.
            </CardParagraph>
            <CardParagraph>
              Step 2 - Visit{' '}
              <StandardLink
                target="_BLANK"
                rel="noreferrer"
                href="https://protonMarket.com">
                ProtonMarket.com
              </StandardLink>
              , connect your wallet in just a few clicks.
            </CardParagraph>
            <CardParagraph>
              Step 3 - Start creating an NFT by clicking “Create,” naming your
              collection, uploading a file, and choosing all of the related
              options.
            </CardParagraph>
            <CardParagraph>
              Step 4 - Spread the word about your NFT on social media to
              increase the likelihood that it will sell!
            </CardParagraph>
          </div>
        </Collapse>
      </Card>

      <Card>
        <CardTitle
          onClick={() => {
            collapseToggle(2);
          }}>
          How to create your own NFT marketplace powered by Proton
        </CardTitle>
        <Collapse
          style={{
            opacity: collapsible.sectionTwo ? 100 : 0,
            visibility: collapsible.sectionTwo ? 'visible' : 'hidden',
          }}>
          <div
            style={{
              display: collapsible.sectionTwo ? 'block' : 'none',
            }}>
            <CardParagraph>
              <strong>
                We firmly believe that whatever can be decentralized, should be
                decentralized.
              </strong>{' '}
              Cryptocurrency is best when more people can exert small amounts of
              collective control, and this logic applies to our own projects as
              well. For this reason,{' '}
              <StandardLink
                target="_BLANK"
                rel="noreferrer"
                href="https://blog.protonchain.com/proton-market-goes-open-source-unlocking-nfts-for-billions-around-the-world/">
                we made the code behind Proton Market open source
              </StandardLink>{' '}
              – meaning anyone can integrate Proton Market into their own
              website without needing to ask permission.
            </CardParagraph>
            <CardParagraph>
              To build on this momentum, we have also released an interactive
              version of Proton Market. With this, creators can not only
              integrate the Proton Market platform into their own website, but
              they can also change the way that it looks and feels so that it
              matches their overall style. By making our marketplace template
              interactive, creators can now change how Proton Market looks when
              it’s on their website - from the font on the headings down to the
              text on the buttons.
            </CardParagraph>
            <CardParagraph>
              Below is a list of features that you can customize based on your
              preferences for how your NFT page should look on your website:
            </CardParagraph>

            <ContainerGrid>
              <Row>
                <Col>
                  <FeatureBox>
                    <FeatureBoxTitle>Theme</FeatureBoxTitle>
                    <FeatureBoxBullet>• Colors</FeatureBoxBullet>
                    <FeatureBoxText>Primary Color</FeatureBoxText>
                    <FeatureBoxText>Secondary Color</FeatureBoxText>
                    <FeatureBoxText>Neutral Colors</FeatureBoxText>
                    <FeatureBoxBullet>• Typography</FeatureBoxBullet>
                    <FeatureBoxText>Header 1</FeatureBoxText>
                    <FeatureBoxText>Header 2</FeatureBoxText>
                    <FeatureBoxText>Header 3</FeatureBoxText>
                    <FeatureBoxText>Header 4</FeatureBoxText>
                    <FeatureBoxText>Paragraph</FeatureBoxText>
                    <FeatureBoxText>Label</FeatureBoxText>
                    <FeatureBoxText>Caption</FeatureBoxText>
                  </FeatureBox>
                </Col>
                <Col>
                  <FeatureBox>
                    <FeatureBoxTitle>Site Menu</FeatureBoxTitle>
                    <FeatureBoxBullet>• Logo</FeatureBoxBullet>
                    <FeatureBoxBullet>• Nav Links</FeatureBoxBullet>
                    <FeatureBoxBullet>• Connect Wallet Button</FeatureBoxBullet>
                  </FeatureBox>
                </Col>
                <Col>
                  <FeatureBox>
                    <FeatureBoxTitle>Header</FeatureBoxTitle>
                    <FeatureBoxBullet>• Background Color</FeatureBoxBullet>
                    <FeatureBoxBullet>• Image Overlay</FeatureBoxBullet>
                    <FeatureBoxBullet>• Label Text</FeatureBoxBullet>
                    <FeatureBoxBullet>• Header Text</FeatureBoxBullet>
                    <FeatureBoxBullet>• Paragraph Text</FeatureBoxBullet>
                    <FeatureBoxBullet>• Button / No Button</FeatureBoxBullet>
                  </FeatureBox>
                </Col>
                <Col>
                  <FeatureBox>
                    <FeatureBoxTitle>Featured NFTs</FeatureBoxTitle>
                    <FeatureBoxBullet>• Sub Header</FeatureBoxBullet>
                    <FeatureBoxBullet>
                      • NFT Layout (Carousel/Vertical Layout)
                    </FeatureBoxBullet>
                  </FeatureBox>
                  <FeatureBox>
                    <FeatureBoxTitle>Footer</FeatureBoxTitle>
                    <FeatureBoxBullet>• Logo</FeatureBoxBullet>
                    <FeatureBoxBullet>• Nav Links</FeatureBoxBullet>
                    <FeatureBoxBullet>• Social Media Icons</FeatureBoxBullet>
                  </FeatureBox>
                </Col>
                <Col>
                  <FeatureBox>
                    <FeatureBoxTitle>
                      NFT Detail Model (From Blockchain)
                    </FeatureBoxTitle>
                    <FeatureBoxBullet>• Image</FeatureBoxBullet>
                    <FeatureBoxBullet>• Name</FeatureBoxBullet>
                    <FeatureBoxBullet>• Description</FeatureBoxBullet>
                    <FeatureBoxBullet>• Price</FeatureBoxBullet>
                    <FeatureBoxBullet>
                      • Select Serial Number drop down
                    </FeatureBoxBullet>
                    <FeatureBoxBullet>• Purchase Button</FeatureBoxBullet>
                    <FeatureBoxBullet>• Share Button</FeatureBoxBullet>
                  </FeatureBox>
                  <FeatureBox>
                    <FeatureBoxTitle>My Items</FeatureBoxTitle>
                    <FeatureBoxBullet>• Share Button</FeatureBoxBullet>
                  </FeatureBox>
                </Col>
              </Row>
            </ContainerGrid>

            <CardParagraph>
              <strong>
                Here’s how to get started creating your own customized NFT
                storefront powered by Proton:
              </strong>
            </CardParagraph>

            <CardParagraph>
              Step 1 - Visit the open-source codebase on Github here:{' '}
              <StandardLink
                target="_BLANK"
                rel="noreferrer"
                href="https://github.com/ProtonProtocol/proton-market-template">
                https://github.com/ProtonProtocol/proton-market-template
              </StandardLink>
            </CardParagraph>
            <CardParagraph>
              Step 2 - Update the “customization.ts” file as you go through this
              document (located here:{' '}
              <StandardLink
                target="_BLANK"
                rel="noreferrer"
                href="https://github.com/ProtonProtocol/proton-market-template/blob/master/custom/customization.ts">
                https://github.com/ProtonProtocol/proton-market-template/blob/master/custom/customization.ts
              </StandardLink>
              ). Once updated, running the server locally will show the correct
              customizations.
            </CardParagraph>
            <CardParagraph>
              Step 3 - View the written text and language that can be edited in
              the file “localization.ts” (located here{' '}
              <StandardLink
                target="_BLANK"
                rel="noreferrer"
                href="https://github.com/ProtonProtocol/proton-market-template/blob/master/custom/localization.ts">
                https://github.com/ProtonProtocol/proton-market-template/blob/master/custom/localization.ts
              </StandardLink>
              ). This gives you the flexibility of changing languages and
              customizing all written text.
            </CardParagraph>
            <CardParagraph>
              Step 4 - Check out more of the exact details here to see how all
              of this will look as you’re working on it:{' '}
              <StandardLink
                target="_BLANK"
                rel="noreferrer"
                href="https://docs.google.com/document/d/12C-lWflPDy3J2mo35X_yE3JiM6mSz18mB1PUQpB4dRY/edit?usp=sharing">
                https://docs.google.com/document/d/12C-lWflPDy3J2mo35X_yE3JiM6mSz18mB1PUQpB4dRY/edit?usp=sharing
              </StandardLink>
            </CardParagraph>
          </div>
        </Collapse>
      </Card>

      <Card>
        <CardTitle
          onClick={() => {
            collapseToggle(3);
          }}>
          Frequently Asked Questions about Proton Market
        </CardTitle>
        <Collapse
          style={{
            opacity: collapsible.sectionThree ? 100 : 0,
            visibility: collapsible.sectionThree ? 'visible' : 'hidden',
          }}>
          <div
            style={{
              display: collapsible.sectionThree ? 'block' : 'none',
            }}>
            <Question>
              What type of files are supported on Proton Market?
            </Question>
            <Answer>PNG, GIF, JPG, WEBP, and MP4</Answer>
            <Question>How does key management work?</Question>
            <Answer>
              Webauth.com is a non-custodial wallet, meaning every user manages
              their own keys. You will never have to manage your users’ keys for
              them.
            </Answer>
            <Question>
              Can users purchase NFTs on the Proton Market using a credit card?
            </Question>
            <Answer>
              No, we currently do not allow direct purchasing of NFTs using a
              credit card on our platform.
            </Answer>
            <Question>
              Do users need a token/coin to purchase NFTs on Proton Market?
            </Question>
            <Answer>
              Yes, users will need XUSDC, which is USDC wrapped on the Proton
              blockchain.
            </Answer>
            <Question>Are there integration points with Ethereum?</Question>
            <Answer>
              Proton has easy to use cross-chain bridges with Ethereum, for all
              major ERC-20 tokens and soon ERC-721 NFTs.
            </Answer>
          </div>
        </Collapse>
      </Card>
    </>
  );
};

export default LearnMoreCard;
