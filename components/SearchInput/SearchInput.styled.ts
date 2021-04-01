import styled from 'styled-components';
import { breakpoint } from '../../styles/Breakpoints';

type InputContainerProps = {
  isMobileSearchOpen: boolean;
};

type CloseIconButtonProps = {
  hasText: boolean;
};

const IconButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  outline: none;
`;

export const MagnifyingIconButton = styled(IconButton)`
  margin-left: 16px;
  ${breakpoint.tablet`
    margin-left: 18px;
  `}
`;

export const CloseIconButton = styled(IconButton)<CloseIconButtonProps>`
  display: ${({ hasText }) => (hasText ? 'flex' : 'none')};
  margin-right: 12px;

  ${breakpoint.tablet`
    display: flex;
  `}
`;

export const InputContainer = styled.div<InputContainerProps>`
  border-radius: 8px;
  border: solid 2px #f2f2f2;
  width: 40%;
  transition: 0.2s;
  display: flex;
  align-items: center;
  background: #f2f2f2;

  :hover,
  :focus,
  :focus-visible {
    border: solid 2px #752eeb;
  }

  @media (max-width: 1360px) {
    width: 45%;
  }

  ${breakpoint.laptop`
    width: 40%;
  `}

  @media (max-width: 1140px) {
    width: 35%;
  }

  @media (max-width: 1040px) {
    width: 30%;
  }

  ${breakpoint.tablet`
    ${({ isMobileSearchOpen }) => !isMobileSearchOpen && `display: none;`}
    z-index: 4;
    position: absolute;
    left: 0;
    width: 100%;
    border-radius: 20px;
    border: solid 2px #752eeb;
    background: white;
  `}
`;

export const Input = styled.input`
  width: 100%;
  font-size: 16px;
  color: black;
  padding: 12px 28px 12px 16px;
  border-radius: 8px;
  border: none;
  outline: none;
  line-height: 24px;
  background: none;

  ::placeholder {
    color: #808080;
  }

  ${breakpoint.tablet`
    border-radius: 20px;
    padding: 8px 16px 8px 18px;
  `}
`;
