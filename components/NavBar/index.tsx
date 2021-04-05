import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Button from '../Button';
import SearchInput from '../SearchInput';
import {
  Background,
  Nav,
  Section,
  AvatarContainer,
  ImageLink,
  DropdownLink,
  GradientBackground,
  DropdownList,
  MobileIcon,
  DesktopIcon,
  DesktopNavLink,
  DesktopOnlySection,
  Name,
  Subtitle,
  Balance,
  OpenSearchButton,
  UserMenuButton,
  UserMenuText,
  CloseIconButton,
} from './NavBar.styled';
import { useScrollLock, useEscapeKeyClose } from '../../hooks';
import { useAuthContext } from '../Provider';
import { ReactComponent as MagnifyingIcon } from '../../public/icon-light-search-24-px.svg';
import { ReactComponent as CloseIcon } from '../../public/icon-light-close-16-px.svg';

type DropdownProps = {
  isOpen: boolean;
  closeNavDropdown: () => void;
};

const Logo = (): JSX.Element => {
  return (
    <Link href="/" passHref>
      <ImageLink>
        <DesktopIcon>
          <Image
            priority
            layout="fixed"
            width={143}
            height={32}
            alt="logo"
            src="/logo-colored@3x.png"
          />
        </DesktopIcon>
        <MobileIcon>
          <Image
            priority
            layout="fixed"
            width={30}
            height={33}
            alt="logo"
            src="/logo.svg"
          />
        </MobileIcon>
      </ImageLink>
    </Link>
  );
};

const UserAvatar = ({ isOpen, avatar, toggleNavDropdown }) => {
  const { currentUserBalance } = useAuthContext();

  const currentUserAvatar = (
    <UserMenuButton>
      <UserMenuText>{currentUserBalance}</UserMenuText>
      <AvatarContainer>
        <Image priority layout="fill" alt="chain account avatar" src={avatar} />
      </AvatarContainer>
    </UserMenuButton>
  );

  const mobileNavbarIcon = isOpen ? (
    <CloseIconButton>
      <CloseIcon />
    </CloseIconButton>
  ) : (
    currentUserAvatar
  );

  return (
    <>
      <DesktopIcon onClick={toggleNavDropdown} role="button">
        {currentUserAvatar}
      </DesktopIcon>
      <MobileIcon onClick={toggleNavDropdown} role="button">
        {mobileNavbarIcon}
      </MobileIcon>
    </>
  );
};

const Dropdown = ({ isOpen, closeNavDropdown }: DropdownProps): JSX.Element => {
  const router = useRouter();
  const { currentUser, currentUserBalance, logout } = useAuthContext();
  useEscapeKeyClose(closeNavDropdown);

  const routes = [
    {
      name: 'Explore',
      path: '/',
      onClick: closeNavDropdown,
    },
    {
      name: 'My items',
      path: `/my-items/${currentUser ? currentUser.actor : ''}`,
      onClick: closeNavDropdown,
    },
    {
      name: 'Sign out',
      path: '',
      onClick: () => {
        closeNavDropdown();
        logout();
        router.push('/');
      },
      isRed: true,
    },
  ];

  return (
    <DropdownList isOpen={isOpen}>
      <Name>{currentUser ? currentUser.name : ''}</Name>
      <Subtitle>Balance</Subtitle>
      <Balance>{currentUserBalance ? currentUserBalance : 0}</Balance>
      {routes.map(({ name, path, onClick, isRed }) =>
        path ? (
          <Link href={path} passHref key={name}>
            <DropdownLink onClick={onClick}>{name}</DropdownLink>
          </Link>
        ) : (
          <DropdownLink tabIndex={0} onClick={onClick} key={name} red={isRed}>
            {name}
          </DropdownLink>
        )
      )}
    </DropdownList>
  );
};

const DesktopNavRoutes = () => {
  const { currentUser } = useAuthContext();
  const router = useRouter();

  const routes = [
    {
      name: 'Explore',
      path: '/',
      isHidden: false,
    },
    {
      name: 'My items',
      path: `/my-items/${currentUser ? currentUser.actor : ''}`,
      isHidden: !currentUser,
    },
    {
      name: 'Create',
      path: `/create`,
    },
  ];

  return (
    <DesktopOnlySection>
      {routes.map(({ name, path, isHidden }) => {
        const isActive = router.pathname.split('/')[1] === path.split('/')[1];
        return isHidden ? null : (
          <Link href={path} passHref key={name}>
            <DesktopNavLink isActive={isActive}>{name}</DesktopNavLink>
          </Link>
        );
      })}
    </DesktopOnlySection>
  );
};

const NavBar = (): JSX.Element => {
  const { currentUser, login } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginDisabled, setIsLoginDisabled] = useState<boolean>(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState<boolean>(false);
  useScrollLock(isOpen);

  const toggleNavDropdown = () => setIsOpen(!isOpen);

  const closeNavDropdown = () => setIsOpen(false);

  const connectWallet = async () => {
    setIsLoginDisabled(true);
    await login();
    closeNavDropdown();
    setIsLoginDisabled(false);
  };

  const mobileSearchHiddenNavItems = isMobileSearchOpen ? null : (
    <>
      <OpenSearchButton onClick={() => setIsMobileSearchOpen(true)}>
        <MagnifyingIcon />
      </OpenSearchButton>
      {currentUser && currentUser.avatar ? (
        <UserAvatar
          isOpen={isOpen}
          avatar={currentUser.avatar}
          toggleNavDropdown={toggleNavDropdown}
        />
      ) : (
        <Button disabled={isLoginDisabled} onClick={connectWallet}>
          Connect Wallet
        </Button>
      )}
    </>
  );

  return (
    <Background>
      <Nav>
        <Logo />
        <SearchInput
          isMobileSearchOpen={isMobileSearchOpen}
          closeMobileSearch={() => setIsMobileSearchOpen(false)}
        />
        <Section>
          <DesktopNavRoutes />
          {mobileSearchHiddenNavItems}
        </Section>
        <Dropdown isOpen={isOpen} closeNavDropdown={closeNavDropdown} />
        <GradientBackground isOpen={isOpen} onClick={closeNavDropdown} />
      </Nav>
    </Background>
  );
};

export default NavBar;
