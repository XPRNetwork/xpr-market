import styled from 'styled-components';
import { ImageContainer } from '../TemplateImage/TemplateImage.styled';

type IconContainerProps = {
  margin?: string;
  width?: string;
};

export const IconContainer = styled(ImageContainer)<IconContainerProps>`
  margin: ${({ margin }) => margin || 0};
  width: ${({ width }) => width || '32px'};
  height: ${({ width }) => width || '32px'};
  border-radius: 100%;
  overflow: hidden;
`;

export const PlaceholderIcon = styled(IconContainer).attrs({ as: 'div' })`
  background-color: #e6e6e6;
  width: ${({ width }) => width || '32px'};
  height: ${({ width }) => width || '32px'};
`;
