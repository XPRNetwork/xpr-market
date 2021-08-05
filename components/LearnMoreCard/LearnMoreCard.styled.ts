import styled from 'styled-components';
import { breakpoint } from '../../styles/Breakpoints';
import { FadeInImageContainer } from '../../styles/FadeInImageContainer.styled';

export const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 850px;
  background: linear-gradient(64deg, #4710a3 14%, #b28bf4 109%);
  margin-top: 40px;
  border-radius: 16px;
  overflow: hidden;

  ${breakpoint.mobile`
    flex-direction: column;
    align-items: center;
    height: 100%;
    margin: 40px 0 0;
  `}
`;

export const Content = styled.div`
  padding: 40px 0px 40px 40px;
  height: 100%;
  min-width: 791px;

  ${breakpoint.tablet`
    min-width: 420px;
  `}

  ${breakpoint.mobile`
    min-width: unset;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: left;
    padding: 32px 16px 0px;
    min-height: 200px;
  `}
`;

export const Title = styled.h1`
  color: #ffffff;
  font-size: 48px;
  line-height: 56px;
  max-width: 618px;

  ${breakpoint.tablet`
    font-size: 32px;
    line-height: 48px;
  `};

  ${breakpoint.mobile`
    font-size: 6vw;
    line-height: 9vw;
    max-width: 100%;
    margin-left: 8px;
  `};
`;

export const Title2 = styled.h2`
  color: #ffffff;
  font-size: 28px;
  line-height: 1.43;
  max-width: 618px;
  height: 80px;

  ${breakpoint.tablet`
    font-size: 26px;
  `};

  ${breakpoint.mobile`
    font-size: 5vw;
    max-width: 100%;
    margin-left: 8px;
  `};
`;

export const SubTitle = styled.p`
  color: #dddddd;
  font-size: 21px;
  line-height: 32px;
  margin: 16px 0 40px;

  ${breakpoint.tablet`
    font-size: 18px;
    line-height: 28px;
    margin: 12px 0 32px;
  `};

  ${breakpoint.mobile`
    font-size: 4.5vw;
    line-height: 8vw;
    margin: 8px auto 24px;
    max-width: 95%;
  `};
`;

export const BannerText = styled.p`
  color: #dddddd;
  font-size: 21px;
  line-height: 32px;
  margin: 16px 0 40px;

  ${breakpoint.tablet`
    font-size: 18px;
    line-height: 28px;
    margin: 12px 0 32px;
  `};

  ${breakpoint.mobile`
    font-size: 4.5vw;
    line-height: 8vw;
    margin: 8px auto 24px;
    max-width: 95%;
  `};
`;

export const TickList = styled.ul`
  list-style-image: url(/proton-mark.png);
  padding-left: 25px;
`;

export const BulletPoint = styled.li`
  color: #dddddd;
  font-size: 21px;
  line-height: 1.52;
  margin: 0px 0px 15px 25px;
  padding-left: 15px;

  ${breakpoint.tablet`
    font-size: 18px;
    line-height: 28px;
    margin: 12px 0 32px;
  `};

  ${breakpoint.mobile`
    font-size: 4.5vw;
    line-height: 8vw;
    margin: 8px auto 24px;
    max-width: 95%;
    padding-left: 5px;
  `};
`;

export const Card = styled.div`
  margin-top: 15px;
  border: 1px solid #e6e6e6;
  border-radius: 16px;
`;

export const CardTitle = styled.div`
  font-size: 21px;
  cursor: pointer;
  user-select: none;
  padding: 26px 24px 30px;

  &:before {
    content: '';
    display: inline-block;
    width: 32px;
    height: 32px;
    background-color: #752eeb;
    border-radius: 32px;
    margin-right: 16px;
    margin-bottom: -6px;
  }
  ${breakpoint.tablet`
    font-size: 18px;
    line-height: 28px;
  `};

  ${breakpoint.mobile`
    &:before {
      content: '';
      display: inline-block;
      width: 22px;
      height: 22px;
      background-color: #752eeb;
      border-radius: 32px;
      margin-right: 10px;
      margin-bottom: -4px;
    }
  `};
`;

export const Collapse = styled.div`
  margin-top: 0;
  transition: visibility 0s, opacity 0.5s linear;
`;

export const CardParagraph = styled.div`
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: #555555;
  margin-bottom: 25px;
  padding-left: 25px;
  padding-right: 25px;
`;
export const StandardLink = styled.a`
  color: #419cff;
  text-decoration: underline;
`;
export const Question = styled.div`
  font-size: 18px;
  font-weight: 500;
  line-height: 1.5;
  color: #333333;
  margin-bottom: 36px;
  padding-left: 25px;
  padding-right: 25px;

  ${breakpoint.mobile`
    {
      margin-bottom: 10px;
      margin-top: 30px;
    }
  `};
`;
export const Answer = styled.div`
  font-size: 16px;
  line-height: 1.5;
  color: #333333;
  margin-left: 36px;
  margin-bottom: 30px;
  padding-left: 25px;
  padding-right: 25px;

  ${breakpoint.mobile`
    {
      padding-left: 10px;
      padding-right: 10px;
      margin-bottom: 15px;
    }
  `};
`;

export const ImageContainer = styled(FadeInImageContainer)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  min-width: 543px;
`;

export const FeatureBox = styled.div`
  background-color: #d8d8d8;
  border: 1px solid #979797;
  padding: 10px 22px 14px;
  border-radius: 15px;
  margin-top: 25px;
  ${breakpoint.mobile`
    min-width: 250px;
  `};
`;

export const FeatureBoxTitle = styled.div`
  color: black;
  font-size: 18px;
  line-height: 24px;
`;

export const FeatureBoxBullet = styled.div`
  color: #555555;
  margin-top: 15px;
  margin-bottom: 15px;
  line-height: 24px;
`;

export const FeatureBoxText = styled.div`
  color: #555555;
  padding-left: 15px;
  line-height: 24px;
`;

export const ButtonWrapper = styled.div`
  width: 148px;
  ${breakpoint.mobile`
    width: 60%;
    margin: 0 auto;
  `};
`;
