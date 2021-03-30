import styled from 'styled-components';

export interface ButtonProps {
  fullWidth?: boolean;
  cancel?: boolean;
}

export const StyledButton = styled.button<ButtonProps>`
  padding: 8px 16px;
  margin: 12px 0;
  border: none;
  border-radius: 8px;
  background-color: ${({ cancel }) => (cancel ? '#f94e6c' : '#752eeb')};
  color: white;
  cursor: pointer;
  transition: 0.2s;
  height: auto;
  font-size: 16px;
  line-height: 24px;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};

  :focus {
    outline: none;
  }

  :hover,
  :focus-visible {
    opacity: 1;
    background-color: ${({ cancel }) => (cancel ? '#e32040' : '#5719bf')};
    box-shadow: 0 8px 12px -4px rgba(130, 136, 148, 0.24),
      0 0 4px 0 rgba(141, 141, 148, 0.16), 0 0 2px 0 rgba(141, 141, 148, 0.12);
  }
`;
