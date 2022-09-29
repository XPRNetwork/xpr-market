import styled from 'styled-components';
import { breakpoint } from '../../styles/Breakpoints';

export const Container = styled.div`
  width: 100%;
  padding: 0 10px;
`;

export const Header = styled.div`
  width: 100%;
  padding: 42px 0px;
  text-align: center;
`;

export const HeaderTitle = styled.p`
  font-size: 48px;
  font-weight: 500;
  line-height: 56px;
  color: #1A1A1A;
  ${breakpoint.mobile`
    font-size: 36px;
  `};
`;

export const SubTitle = styled.p`
  width: 100%;
  max-width: 500px;
  color: #808080;
  font-size: 20px;
  font-weight: 450;
  line-height: 28px;
  margin: 30px auto 0;
`;

export const ContentHeader = styled.p`
  color: #1A1A1A;
  margin: 10px auto;
  font-size: 28px;
  line-height: 35px;
  font-weight: 500;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #FEFEFE;
  margin: 0 auto 20px;
`;

export const Switch = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 20px 0;
  color: #6B717F;
  ${breakpoint.mobile`
    & > span {
      display: none;
    };
  `};
`;

export const SwitchIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  font-weight: 100;
  font-size: 36px;
  border-radius: 50%;
  color: #752EEB;
  background: #F0E8FD;
  padding-left: 4px;
  cursor: pointer;
`;

export const ChainBtn = styled.div<{isFrom: boolean}>`
  order: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 120px;
  border-radius: 8px;
  font-size: 16px;
  color: #1A1A1A;
  padding: 4px 10px;
  background: #F2F2F2;
  margin: 0 20px;

  ${({ isFrom }) =>
  !isFrom &&
  `
  order: 5
  `};
`;

export const InfoBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-itmes: center;
  width: 100%;
  max-width: 400px;
  padding: 30px 0 0;
  color: #4710a3;
  ${breakpoint.mobile`
    flex-direction: column;
    align-items: center;
  `};
`;

export const MessageBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0px;
  color: #808080;
  text-align: center;
  font-size: 20px;
  font-weight: 450;
  line-height: 28px;
`;

export const NftBox = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;
  border-bottom: 1px solid #808080;
  padding: 20px 0;
  ${breakpoint.tablet`
    grid-template-columns: repeat(2, 1fr);
  `};
  ${breakpoint.mobile`
    grid-template-columns: 1fr;
  `};
`;

export const NftItem = styled.div<{selected: boolean}>`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 4px;
  // border: 1px solid #752EEB;
  border-radius: 4px;
  margin: 4px 0;
  cursor: pointer;
  ${({ selected }) =>
    selected &&
    `
    color: #fff;
    background-color: #4710a3;
  `};
`;

export const NftName = styled.p`
  flex: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const TabContainer = styled.div`
  position: relative;
  width: 100%;
  padding: 20px 0 0;
  background-color: #FEFEFE;
`;

export const Tabs = styled.div`
  display: flex;
  align-items: flex-end;
  border-bottom: 1px solid #808080;
`;

export const Tab = styled.div<{selected: boolean, align?: string}>`
  width: 100%;
  max-width: 200px;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  color: #6B717F;
  padding: 5px 0;
  border-bottom: 3px solid transparent;
  cursor: pointer;

  ${({ selected }) =>
    selected &&
    `
    color: #1A1A1A;
    border-bottom: 3px solid #752EEB;
  `};

  ${({ align }) =>
    align == 'right' &&
    `
    margin-left: auto
  `};
`;

export const PlusIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  font-weight: 100;
  font-size: 22px;
  border-radius: 50%;
  color: #fff;
  background: #752EEB;
`;

export const AddNFTBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #752EEB;
  font-size: 16px;
  cursor: pointer;
  margin-top: 30px;
  border: none;
  background: transparent;
`;

export const NoNFTBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid #808080;
  padding: 20px 0;
`;


export const Row = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  ${breakpoint.mobile`
    flex-direction: column;
    justify-content: center;
  `};
`;

export const TableHeaderCell = styled.th`
  padding: 12px 4px;
  font-size: 14px;
  line-height: 12px;
  font-weight: 600;
  color: #1A1A1A;
  text-align: center;
`;

export const TableDataCell = styled.td`
  padding: 10px 4px;
  font-size: 14px;
  line-height: 24px;
  font-weight: 450;
  color: #000;
  text-align: center;
`;
