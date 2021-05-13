import styled from 'styled-components';

type TabProps = {
  isActive: boolean;
};

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
