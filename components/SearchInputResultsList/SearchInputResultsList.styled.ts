import styled from 'styled-components';
import { breakpoint } from '../../styles/Breakpoints';

export const ResultsList = styled.ul`
  position: absolute;
  width: inherit;
  top: 60px;
  background: #ffffff;
  border: 1px solid #f2f2f2;
  border-radius: 8px;
  padding: 24px 16px;

  ${breakpoint.tablet`
    top: 48px;
  `}
`;

export const ResultListTitle = styled.h3`
  font-family: CircularStdBold;
  font-size: 14px;
  line-height: 24px;
  color: #808080;
  margin: 0 8px 8px;
`;

export const ResultItem = styled.li`
  transition: 0.2s;
  display: flex;
  align-items: center;
  padding: 8px;
  outline: none;
  cursor: pointer;
  border-radius: 6px;

  :hover,
  :focus-visible {
    background: #f2f2f2;
  }

  :focus-visible {
    color: #752eeb;
  }
`;
