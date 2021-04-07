import styled from 'styled-components';

export const Container = styled.section`
  max-width: 60%;
  min-width: 784px;
  width: 100%;
  margin: 0 auto;
`;

export const Row = styled.div`
  display: flex;
  width: 100%;
`;

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-right: 20px;
`;

export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 320px;
  margin: 138px 0 0 20px;
`;

export const Title = styled.h1`
  font-size: 28px;
  line-height: 40px;
  color: #1a1a1a;
  margin-top: 40px;
`;

export const SubTitle = styled.p`
  font-size: 14px;
  line-height: 24px;
  color: #333333;
  margin-top: 8px;
  max-width: 424px;
`;

export const ElementTitle = styled.h2`
  font-size: 18px;
  line-height: 24px;
  color: #1a1a1a;
  margin-top: 32px;
  margin-bottom: 16px;
`;

export const EmptyBox2 = styled.div`
  width: 136px;
  height: 136px;
  background-color: #e6e6e6;
  margin-right: 8px;
  border-radius: 8px;
`;

export const Terms = styled.p`
  font-size: 12px;
  line-height: 20px;
  color: #808080;
  margin-top: 24px;
`;

export const TermsLink = styled.a`
  font-size: 12px;
  line-height: 20px;
  color: #752eeb;
  cursor: pointer;
  margin-bottom: 24px;
`;

export const BoxButton = styled.button`
  border: none;
  background: none;
  border-radius: 8px;
  border: 1px solid #e6e6e6;
  width: 136px;
  height: 136px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
  font-size: 16px;
  color: #1a1a1a;
  cursor: pointer;
  outline: none;

  span {
    margin-top: 8px;
  }

  :hover,
  :focus-visible {
    border: 1px solid #752eeb;
  }
`;
