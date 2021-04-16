import styled from 'styled-components';

export const Input = styled.input`
  font-size: 16px;
  line-height: 24px;
  color: #1a1a1a;
  border-radius: 8px;
  padding: 12px 16px;
  border: solid 1px #e6e6e6;
  margin-bottom: 12px;
  width: 100%;

  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
  }

  ::placeholder {
    color: #808080;
  }
`;
