import { MouseEvent, KeyboardEvent } from 'react';
import { useModalContext } from '../Provider';
import { ReportProps } from '../Provider/ModalProvider';
import { useAuthContext } from '../Provider';
import { useRouter } from 'next/router';
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
  ErrorMessage,
} from './Modal.styled';
import { ReactComponent as CloseIcon } from '../../public/close.svg';
import { useWindowSize } from '../../hooks';
import { capitalize } from '../../utils';
import { REPORT_TYPE_TO_REFTYPE, REPORT_TYPE } from '../../utils/constants';
import Spinner from '../Spinner';
import { sendToApi } from '../../utils/browser-fetch';
import { ReportBody, ReportResponse } from '../../services/report';

export const ReportModal = (): JSX.Element => {
  const [hasReported, setHasReported] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [input, setInput] = useState<string>('');
  const { closeModal, modalProps } = useModalContext();
  const { isMobile } = useWindowSize();
  const { currentUser, isLoadingUser } = useAuthContext();
  const router = useRouter();
  const { query } = router;
  const actor = currentUser ? currentUser.actor : '';
  const { type } = modalProps as ReportProps;

  const handleBackgroundClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const getRefId = (): string => {
    switch (type) {
      case REPORT_TYPE.CREATOR: {
        return query.chainAccount as string;
      }
      case REPORT_TYPE.COLLECTION: {
        return query.collection as string;
      }
      case REPORT_TYPE.NFT: {
        return query.templateId as string;
      }
      default: {
        return '';
      }
    }
  };

  const submit = async () => {
    if (!isLoadingUser && actor) {
      setIsLoading(true);
      setError('');
      const reportBody: ReportBody = {
        reportingAccount: actor,
        refType: REPORT_TYPE_TO_REFTYPE[type],
        refId: getRefId(),
        reason: input.trim(),
        url: window.location.href,
      };

      if (!reportBody.refId) {
        setIsLoading(false);
        setError('Error: An error has occurred');
        throw new Error('Report body is missing refId');
      }

      try {
        const res = await sendToApi<ReportResponse, ReportBody>(
          'POST',
          '/api/report',
          reportBody
        );

        if (!res.success) {
          throw new Error((res.message as unknown) as string);
        }

        setHasReported(true);
        setTimeout(() => closeModal(), 1500);
      } catch (e) {
        setError(`Error: ${e.message || 'An error occured during the report'}`);
      }
      setIsLoading(false);
    }
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
          <Title>Report this {capitalize(type.toLowerCase())}?</Title>
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
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Please provide details on why you are concerned about this ${type.toLowerCase()}.`}
        />
        <ErrorMessage>{error}</ErrorMessage>
        <HalfButton
          disabled={!input || !actor}
          fullWidth={isMobile}
          onClick={submit}>
          {isLoading ? (
            <Spinner size="25px" radius="15" hasBackground />
          ) : hasReported ? (
            'Reported!'
          ) : (
            'Report'
          )}
        </HalfButton>
      </ModalBox>
    </Background>
  );
};
