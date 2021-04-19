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

export const VideoContainer = styled(FadeInImageContainer)<ImageContainerProps>`
  ${SquareContainerCSS};
  position: relative;
  border-radius: 8px;
  margin-bottom: 24px;
`;

export const CenterContainer = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

export const Video = styled.video`
  position: absolute;
  width: 100%;
  border-radius: 16px;
  outline: none;
`;
