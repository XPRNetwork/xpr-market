import styled from 'styled-components';
import { breakpoint } from './Breakpoints';

type CollectionTitleRowProps = {
  margin?: string;
};

export const Title = styled.h1`
  font-size: 28px;
  line-height: 40px;
  color: #1a1a1a;
  margin: 40px 0 32px;

  ${breakpoint.mobile`
    margin: 32px 0;
    font-size: 18px;
    line-height: 24px;
  `}
`;

export const CollectionTitle = styled.h2`
  font-size: 24px;
  line-height: 30px;
  color: #1a1a1a;
  cursor: pointer;
`;

export const PurpleSpan = styled(Title).attrs({ as: 'span' })`
  color: #752eeb;
`;

export const CollectionTitleRow = styled.div<CollectionTitleRowProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: ${({ margin }) => (margin ? margin : '40px 0px')};
`;
