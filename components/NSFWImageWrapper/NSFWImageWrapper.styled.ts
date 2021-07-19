import styled from 'styled-components';

type ImgProps = {
  width?: string;
  height?: string;
  objectFit?: string;
};

interface BlockedImageProps extends ImgProps {
  blurImage: number;
}

export const ImageStyled = styled.img<ImgProps>`
  height: ${({ height }) => height || '270px'};
  width: ${({ width }) => width || '270px'};
  object-fit: ${({ objectFit }) => objectFit || ''};
`;

export const BlockedImage = styled.div<BlockedImageProps>`
  height: ${({ height }) => height || '270px'};
  width: ${({ width }) => width || '270px'};
  min-width: 135px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-image: url(${({ blurImage }) => `/blur-image-${blurImage}.png`});
`;

export const NSFWButton = styled.button`
  border: 1px solid white;
  border-radius: 4px;
  background-color: transparent;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 0px 10px;
  cursor: pointer;
`;

export const DefaultImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f2f2f2;
`;
