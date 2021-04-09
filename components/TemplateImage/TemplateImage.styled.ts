import styled, { css } from 'styled-components';
import { FadeInImageContainer } from '../../styles/FadeInImageContainer.styled';

type ImageContainerProps = {
  isAudio?: boolean;
  isVideo?: boolean;
};

const SquareContainerCSS = css`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 100%;
`;

export const ImageContainer = styled(FadeInImageContainer)<ImageContainerProps>`
  position: relative;
  border-radius: 8px;
  margin-bottom: 24px;

  ${({ isAudio, isVideo }) =>
    isAudio || isVideo ? `${SquareContainerCSS}` : ''};
`;

export const IconContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0e8fd;
  border-radius: 16px;
`;
