import { MouseEvent, KeyboardEvent } from 'react';
import { useModalContext } from '../Provider';
import { ReportProps } from '../Provider/ModalProvider';
import { useState } from 'react';
import {
  Background,
  ModalBox,
  Section,
  CloseIconContainer,
  Title,
  Description,
  HalfButton,
  TextArea,
  Link,
} from './Modal.styled';
import { ReactComponent as CloseIcon } from '../../public/close.svg';
import { useWindowSize } from '../../hooks';

export const ReportModal = (): JSX.Element => {
  const { isMobile } = useWindowSize();
  const { closeModal, modalProps } = useModalContext();
  const { type } = modalProps as ReportProps;
  const [input, setInput] = useState<string>('');

  const handleBackgroundClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const submit = () => {
    // TODO: replace with backend report support endpoint
    console.log('Report: ', input);
  };

  const onEnterKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && input) {
      submit();
    }
  };

  return (
    <Background onClick={handleBackgroundClick}>
      <ModalBox>
        <Section>
          <Title>Report this {type}?</Title>
          <CloseIconContainer role="button" onClick={closeModal}>
            <CloseIcon />
          </CloseIconContainer>
        </Section>
        <Description>
          We take reports of harm and abuse seriously. To learn more about our
          standards for member behavior, you can read our{' '}
          {
            // TODO: need to input link once ready
          }
          <Link target="_blank" rel="noreferrer">
            Community Guidelines
          </Link>
          .
        </Description>
        <TextArea
          maxLength={250}
          value={input}
          onKeyPress={onEnterKey}
          onChange={(e) => setInput(e.target.value.trim())}
          placeholder={`Please provide details on why you are concened about this ${type.toLowerCase()}.`}
        />
        <HalfButton
          disabled={!input}
          fullWidth={isMobile}
          margin="0 0 12px"
          onClick={submit}>
          Report
        </HalfButton>
      </ModalBox>
    </Background>
  );
};
