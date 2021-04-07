import styled from 'styled-components';
import { FadeInImageContainer } from '../../styles/FadeInImageContainer.styled';

type CardProps = {
  hasMultiple: boolean;
};

type GreyTextProps = {
  price?: string;
};

export const Card = styled.article<CardProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  cursor: pointer;
  outline: none;
  border-radius: 16px;
  border: solid 1px #e6e6e6;
  box-sizing: border-box;
  padding: 0 24px 24px;
  position: relative;
  transition: 0.3s;

  :hover,
  :focus-visible {
    transform: scale(1.02);
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

export const ImageContainer = styled(FadeInImageContainer)`
  position: relative;
  border-radius: 8px;
  margin-bottom: 24px;
  overflow: hidden;
  backface-visibility: hidden;
  transform: translate3d(0, 0, 0);
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -webkit-transform: translate3d(0, 0, 0);
  -moz-transform: translate3d(0, 0, 0);
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

export const CollectionNameButton = styled.button`
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: transparent;
  outline: none;
  border: none;
  z-index: 1;

  :hover {
    transform: scale(1.05);
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
