import styled from 'styled-components';
import { breakpoint } from '../../styles/Breakpoints';

type TabProps = {
  isActive: boolean;
};

export const Row = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 40px;

  ${breakpoint.tablet`
    justify-content: center;
  `}
`;

export const Tab = styled.p<TabProps>`
  font-family: CircularStdBold;
  font-size: 16px;
  line-height: 24px;
  color: ${({ isActive }) => (isActive ? '#1a1a1a' : '#808080')};
  padding-bottom: 8px;
  margin-right: 16px;
  border-bottom: ${({ isActive }) => (isActive ? '2px solid #752eeb' : '')};
  cursor: pointer;
`;
