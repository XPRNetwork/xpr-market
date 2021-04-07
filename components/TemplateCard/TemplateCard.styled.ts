import styled, { css } from 'styled-components';
import { FadeInImageContainer } from '../../styles/FadeInImageContainer.styled';

type CardProps = {
  hasMultiple: boolean;
  noHoverEffect: boolean;
  isStatic?: boolean;
};

type GreyTextProps = {
  price?: string;
};

type ImageContainerProps = {
  isAudio?: boolean;
  isVideo?: boolean;
};

type CollectionNameButtonProps = {
  isStatic?: boolean;
};

export const Card = styled.article<CardProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  outline: none;
  border-radius: 16px;
  border: solid 1px #e6e6e6;
  box-sizing: border-box;
  padding: 0 24px 24px;
  position: relative;
  transition: 0.3s;

  ${({ isStatic }) => (isStatic ? '' : 'cursor: pointer')};
  :hover {
    transform: ${({ noHoverEffect }) =>
      noHoverEffect ? 'none' : 'scale(1.02)'};
  }

  :focus-visible {
    transform: ${({ noHoverEffect }) =>
      noHoverEffect ? 'none' : 'scale(1.02)'};
  }

  ${({ hasMultiple }) =>
    hasMultiple &&
    `
    :before {
      display: block;
      content: '';
      height: 100%;
      width: 97.5%;
      position: absolute;
      top: 5px;
      left: 0.75%;
      border-bottom: solid 1px #e6e6e6;
      border-radius: 16px;
    }

    :after {
      display: block;
      content: '';
      height: 100%;
      width: 95%;
      position: absolute;
      top: 10px;
      left: 2%;
      border-bottom: solid 1px #e6e6e6;
      border-radius: 16px;
    }
  `}
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
`;

export const ImageContainer = styled(FadeInImageContainer)<ImageContainerProps>`
  position: relative;
  border-radius: 8px;
  margin-bottom: 24px;

  ${({ isAudio, isVideo }) =>
    isAudio || isVideo ? `${SquareContainerCSS}` : ''};
`;

const SquareContainerCSS = css`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 100%;
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

export const Title = styled.h1`
  font-size: 21px;
  line-height: 32px;
  color: #1a1a1a;
  margin-bottom: 8px;
`;

export const Text = styled.span`
  font-size: 16px;
  line-height: 24px;
  color: #1a1a1a;
`;

export const CollectionNameButton = styled.button<CollectionNameButtonProps>`
  display: flex;
  align-items: center;
  background-color: transparent;
  outline: none;
  border: none;
  z-index: 1;
  ${({ isStatic }) => (isStatic ? '' : 'cursor: pointer')};

  :hover {
    ${({ isStatic }) => (isStatic ? '' : 'transform: scale(1.05)')};
  }
`;

export const GreyText = styled(Text)<GreyTextProps>`
  color: #808080;
  margin-bottom: 8px;
`;

export const Tag = styled.div`
  font-family: CircularStdBold;
  font-size: 10px;
  line-height: 16px;
  letter-spacing: 1px;
  position: absolute;
  bottom: 0;
  margin: 16px;
  padding: 8px 16px;
  opacity: 0.6;
  border-radius: 4px;
  background-color: #1a1a1a;
  color: #ffffff;
`;

export const PlaceholderPrice = styled.div`
  height: 8px;
`;
