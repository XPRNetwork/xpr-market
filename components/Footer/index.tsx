import Image from 'next/image';
import {
  ImageContainer,
  StyledFooter,
  Section,
  FooterLink,
} from './Footer.styled';

const links = [
  {
    name: 'Terms of Service',
    url: 'https://www.protonchain.com/terms',
  },
  {
    name: 'Privacy',
    url: 'https://www.protonchain.com/terms#privacy-policy',
  },
  {
    name: 'Help',
    url: 'https://support.protonchain.com/support/home',
  },
];

const Footer = (): JSX.Element => {
  return (
    <StyledFooter>
      <ImageContainer>
        <Image
          priority
          layout="fixed"
          width={143}
          height={32}
          alt="logo"
          src="/logo@3x.png"
        />
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
