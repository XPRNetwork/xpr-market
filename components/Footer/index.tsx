import { Image } from '../../styles/index.styled';
import {
  ImageContainer,
  StyledFooter,
  Section,
  FooterLink,
} from './Footer.styled';

const links = [
  {
    name: 'Get Wallet',
    url: 'https://wauth.co',
  },
  {
    name: 'XPR Network',
    url: 'https://xprnetwork.org',
  },
  {
    name: 'Community',
    url: 'https://t.me/XPRNetwork',
  },
  {
    name: 'Terms of Service',
    url: 'https://xprnetwork.org/webauth-terms',
  },
  {
    name: 'Help',
    url: 'https://help.xprnetwork.org',
  },
];

const Footer = (): JSX.Element => {
  return (
    <StyledFooter>
      <ImageContainer>
        <Image width="168px" height="32px" alt="logo" src="/xprnetwork_nft_gray.svg" />
      </ImageContainer>
      <Section>
        {links.map(({ name, url }) => (
          <FooterLink key={name} href={url} target="_blank" rel="noreferrer">
            {name}
          </FooterLink>
        ))}
      </Section>
    </StyledFooter>
  );
};

export default Footer;
