import styled from 'styled-components';

type DescriptionProps = {
  mb: string;
  maxWidth: string;
};

export const Description = styled.span<DescriptionProps>`
  margin-bottom: ${({ mb }) => mb};
  max-width: ${({ maxWidth }) => maxWidth};
  font-size: 14px;
  line-height: 24px;
  color: #1a1a1a;
`;

export const More = styled.span`
  color: #752eeb;
  cursor: pointer;
  font-size: 12px;
`;
