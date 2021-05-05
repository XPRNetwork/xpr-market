import styled from 'styled-components';

type AvatarImageProps = {
  size?: string;
};

export const AvatarImage = styled.div<AvatarImageProps>`
  border-radius: 100%;
  overflow: hidden;
  width: ${({ size }) => (size ? size : '32px')};
  height: ${({ size }) => (size ? size : '32px')};
  margin-left: 10px;
`;
