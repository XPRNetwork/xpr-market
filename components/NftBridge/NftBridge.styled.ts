import styled from 'styled-components';
import { breakpoint } from '../../styles/Breakpoints';

export const Header = styled.div`
  width: 100%;
  padding: 60px 120px 0;
  background: linear-gradient(64deg, #4710a3 14%, #b28bf4 109%);
  border-radius: 0 0 8px 8px;
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
  background-color: #FEFEFE;
  font-size: 22px;
  font-weight: 600;
`;

export const Container = styled.div`
  width: 100%;
  padding: 0 120px;
`;

export const Content = styled.div`
  max-width: 900px;
  width: 100%;
  min-height: 300px;
  border-top: 1px solid #F6F7F9;
  border-radius: 0 0 14px 14px;
  background-color: #FEFEFE;
  box-shadow: 0px 1px 2px rgba(0,0,0,0.3);
  margin-bottom: 20px;
`;

export const Switch = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 20px;
  border-bottom: 1px solid #F6F7F9;
`;

export const InfoBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-itmes: center;
  padding: 20px 20px 0;
  // border-bottom: 1px solid #F6F7F9;
  color: #4710a3;
`;

export const CurrentDir = styled.div`
  flex: 1;
  font-size: 20px;
  font-weight: 350;
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
  padding: 10px 20px;
  border-bottom: 1px solid #e8e8e8;
`;

export const MessageContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  // background-color: #FFE8C3;
  border-radius: 8px;
  padding: 5px;
`;

export const NftBox = styled.div`
  display: flex;
  padding: 20px;
`;

export const NftList = styled.div`
  flex: 1;
  height: 250px;
  overflow-y: auto;
  padding: 20px 0;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
`;

export const NftExchangeBtnBox = styled.div`
  width: 50px;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5px;
`;

export const NftItem = styled.div<{selected: boolean}>`
  display: flex;
  align-items: center;
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #EFEFEF;
  cursor: pointer;
  // :hover {
  //   background-color: #e7eaf3;
  // }

  ${({ selected }) =>
    selected &&
    `
    color: #fff;
    background-color: #4710a3;
  `};
`;

export const NftName = styled.p`
  width: 200px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const TableContent = styled.div`
  width: 100%;
  padding: 20px 0;
  background-color: #FEFEFE;
  margin-bottom: 20px;
`;

export const Tabs = styled.div`
  display: flex;
  align-items: flex-end;
  padding: 4px 0px;
  margin-bottom: 20px;
`;

export const Tab = styled.div<{selected: boolean}>`
  text-align: center;
  color: #6a6a6a;
  margin-right: 20px;
  padding: 5px 0;
  border-bottom: 2px solid transparent;
  cursor: pointer;

  ${({ selected }) =>
    selected &&
    `
    color: #000;
    border-bottom: 2px solid #4710a3;
  `};
`;
