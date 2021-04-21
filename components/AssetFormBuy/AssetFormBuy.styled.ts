import styled from 'styled-components';
import { breakpoint } from '../../styles/Breakpoints';

export const General = styled.p`
  color: #808080;
  font-size: 12px;
  line-height: 24px;
`;

export const Amount = styled.h3`
  font-size: 28px;
  line-height: 32px;
  margin: 4px 0 32px;
  color: #1a1a1a;

  ${breakpoint.mobile`
    font-weight: normal;
  `}
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const ErrorMessage = styled.p`
  color: #b57579;
  font-size: 16px;
  line-height: 24px;
`;

export const DropdownMenu = styled.select`
  font-size: 16px;
  margin-bottom: 12px;
  padding: 0 16px;
  width: 100%;
  height: 40px;
  color: #808080;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  cursor: pointer;
  line-height: 24px;
  position: relative;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: url('/down-arrow.svg');
  background-repeat: no-repeat;
  background-position: top 2px right 15px;

  &:hover {
    border: 1px solid #e6e6e6;
  }
`;
