import { url } from 'node:inspector';
import styled from 'styled-components';
import { FadeInImageContainer } from '../../styles/FadeInImageContainer.styled';

type ImageContainerProps = {
  isAudio?: boolean;
  isVideo?: boolean;
};

export const ImageContainer = styled(FadeInImageContainer)<ImageContainerProps>`
  position: relative;
  border-radius: 8px;
  margin-bottom: 24px;
`;

export const DefaultImage = styled.img`
  width: 100%;
  height: 100%;
`;

export const Image = styled.img`
  max-height: 270px;
  max-width: 270px;
  width: 100%;
  object-fit: cover;
`;
