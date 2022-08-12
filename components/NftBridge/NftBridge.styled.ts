import styled from 'styled-components';
import { breakpoint } from '../../styles/Breakpoints';

export const Header = styled.div`
  width: 100%;
  padding: 60px 180px 0;
  background: linear-gradient(64deg, #4710a3 14%, #b28bf4 109%);
  margin-top: 40px;
  border-radius: 16px;
  overflow: hidden;
  color: #fff;
`;

export const HeaderTitle = styled.p`
  font-size: 36px;
  font-weight: 500;
`;

export const SubTitle = styled.p`
  width: 100%;
  max-width: 900px;
  color: #D8C4F7;
  font-size: 16px;
  line-height: 32px;
  margin: 16px 0 60px;

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

export const ContentHeader = styled.div`
  display: flex;
  align-items: center;
  max-width: 900px;
  width: 100%;
  height: 60px;
  color: black;
  padding: 20px;
  border-radius: 14px 14px 0 0;
  background-color: #F4F7F9;
`;

export const Container = styled.div`
  width: 100%;
  padding: 0 180px;
`;

export const Content = styled.div`
  max-width: 900px;
  width: 100%;
  min-height: 300px;
  border-top: 1px solid #e8e8e8;
  border-radius: 0 0 14px 14px;
  background-color: #F4F7F9;
  box-shadow: 1px 1px 2px rgba(0,0,0,0.1);
`;

export const Switch = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 20px;
  border-bottom: 1px solid #e8e8e8;
`;

export const CurrentDir = styled.div`
  flex: 1;
  font-size: 20px;
  font-weight: 500;
  color: #4710a3;
`;

export const NextDir = styled.div`
  flex: 1;
  font-size: 16px;
  color: #6a6a6a;
  text-align: right;
`;

export const MessageBox = styled.div`
  width: 100%;
  padding: 20px;
  border-bottom: 1px solid #e8e8e8;
`;

export const MessageContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #FFE8C3;
  border-radius: 8px;
  padding: 20px;
`;

export const NftBox = styled.div`
  display: flex;
  padding: 20px;
`;

export const NftList = styled.div`
  flex: 1;
  padding: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
`;

export const NftExchangeBtnBox = styled.div`
  width: 30px;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export const NftName = styled.p`
  width: 200px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;
