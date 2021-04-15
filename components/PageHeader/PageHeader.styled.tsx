import styled from 'styled-components';
import { breakpoint } from '../../styles/Breakpoints';

export const PageHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 40px;
  padding-bottom: 50px;
`;

export const ImageContainer = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 100%;
  margin-bottom: 32px;
  overflow: hidden;

  ${breakpoint.mobile`
    width: 112px;
    height: 112px;
    margin-bottom: 24px;
  `}
`;

export const Name = styled.p`
  font-size: 48px;
  line-height: 1.17;
  color: #1a1a1a;
  text-align: center;

  ${breakpoint.mobile`
    font-size: 40px;
    line-height: 1.4;
  `}
`;

export const SubName = styled.p`
  line-height: 1.43;
  font-size: 28px;
  color: #752eeb;

  ${breakpoint.mobile`
    font-size: 21px;
    line-height: 1.52;
  `}
`;

export const Description = styled.p`
  font-size: 14px;
  line-height: 1.71;
  color: #1a1a1a;
  margin-top: 16px;
`;

export const IconButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: transparent;
  height: 40px;
  width: 40px;
  border-radius: 100%;
  border: 1px solid #e6e6e6;
  cursor: pointer;
  outline: none;

  :hover {
    background-color: rgba(230, 230, 230, 0.3);
  }

  ${breakpoint.mobile`
    margin-top: 5px;
  `}

  > svg {
    position: absolute;
    left: 7px;
    top: 6px;
  }
`;
