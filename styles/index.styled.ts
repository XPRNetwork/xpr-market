import styled from 'styled-components';

type ImgProps = {
  width?: string;
  height?: string;
  objectFit?: string;
};

type RowProps = {
  justifyContent?: string;
  alignItems?: string;
};

export const Image = styled.img<ImgProps>`
  width: ${({ width }) => width || '270px'};
  height: ${({ height }) => height || '270px'};
  object-fit: ${({ objectFit }) => objectFit || ''};
`;

export const Row = styled.div<RowProps>`
  display: flex;
  justify-content: ${({ justifyContent }) => justifyContent || 'space-between'};
  align-items: ${({ alignItems }) => alignItems || 'flex-start'};
  width: 100%;
`;
