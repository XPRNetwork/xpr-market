import styled from 'styled-components';
import { breakpoint } from '../../styles/Breakpoints';
import { FadeInImageContainer } from '../../styles/FadeInImageContainer.styled';

export interface TabTitleProps {
  isActive: boolean;
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 64px auto 0px;
  justify-content: center;
  align-items: center;
  width: 944px;

  ${breakpoint.laptop`
    width: 100%;
  `};

  ${breakpoint.mobile`
    margin: 32px 0 0;
  `};
`;

export const Row = styled.div`
  width: 100%;
  display: flex;

  ${breakpoint.mobile`
    flex-direction: column;
  `}
`;

export const Column = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 0 64px 0 56px;

  ${breakpoint.mobile`
    margin: 0;
  `}
`;

export const ImageContainer = styled(FadeInImageContainer)`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 500px;

  > div {
    width: 100%;
  }

  ${breakpoint.tablet`
    max-width: 294px;
  `};

  ${breakpoint.mobile`
    max-width: 100%;
    margin: 0px auto 32px;
  `};
`;

export const TemplateImage = styled.img`
  object-fit: contain;
  width: 100%;
  height: 100%;
`;

export const Video = styled.video`
  width: 100%;
  max-height: 100%;
  border-radius: 16px;
  outline: none;
`;

export const TabTitle = styled.h1<TabTitleProps>`
  font-size: 16px;
  line-height: 24px;
  font-family: CircularStdBold;
  padding: 0 16px 8px;
  color: ${({ isActive }) => (isActive ? '#1a1a1a' : '#808080')};
  border-bottom: ${({ isActive }) => (isActive ? '2px solid #752eeb' : '')};
  cursor: pointer;
`;

export const TabRow = styled.div`
  display: flex;
  width: 100%;
  margin: 48px 0 22px;
  border-bottom: 1px solid #e6e6e6;

  ${breakpoint.tablet`
    justify-content: center;
  `};
`;

export const Divider = styled.div`
  margin: 24px 0;
  border-bottom: 1px solid #e8ecfd;
`;
