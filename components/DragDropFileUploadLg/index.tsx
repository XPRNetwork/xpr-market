/* eslint-disable jsx-a11y/media-has-caption */
import { useCallback, useState, Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import {
  Container,
  FileTypeDescription,
  UploadButton,
  UploadError,
  RemovePreviewIcon,
  Preview,
  ImageInfo,
  FilenameInfo,
  PreviewImageContainer,
  FileNameText,
  FileSize,
} from './DragDropFileUploadLg.styled';
import {
  LG_FILE_UPLOAD_TYPES_TEXT,
  LG_FILE_UPLOAD_TYPES,
  LG_FILE_SIZE_UPLOAD_LIMIT,
} from '../../utils/constants';
import { ReactComponent as UploadIcon } from '../../public/upload-icon.svg';
import { ReactComponent as CloseIcon } from '../../public/close.svg';
import { fileReader } from '../../utils';

type Props = {
  setTemplateUploadedFile: Dispatch<SetStateAction<File>>;
  templateUploadedFile: File;
  setFormError: Dispatch<SetStateAction<string>>;
};

const DragDropFileUploadLg = ({
  setTemplateUploadedFile,
  templateUploadedFile,
  setFormError,
}: Props): JSX.Element => {
  const onDrop = useCallback((acceptedFiles) => {
    setFormError('');
    setUploadError('');
    const file = acceptedFiles[0];
    const isAcceptedFileType = LG_FILE_UPLOAD_TYPES[file.type] || false;
    const isAcceptedFileSize = file.size <= LG_FILE_SIZE_UPLOAD_LIMIT; // 30MB
    if (isAcceptedFileType && isAcceptedFileSize) {
      setUploadPreview(null);
      setTemplateUploadedFile(file);
      fileReader((result) => setUploadPreview(result), file);
    } else {
      setUploadError(
        'Unable to upload, please double check your file size or file type.'
      );
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const [uploadPreview, setUploadPreview] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');

  return (
    <Container {...getRootProps()} isDragActive={isDragActive}>
      <input
        {...getInputProps()}
        accept="image/png,image/jpg,image/jpeg,image/webp,image/gif,video/mp4,.png,.jpg,.jpeg,.webp,.mpeg,.gif,.mp4"
      />
      {templateUploadedFile && uploadPreview ? (
        <Preview>
          <ImageInfo>
            <PreviewImageContainer>
              {templateUploadedFile.type.includes('mp4') ? (
                <video width="64" height="64" preload="metadata">
                  <source src={`${uploadPreview}#t=0.1`} />
                </video>
              ) : (
                <Image
                  priority
                  layout="fixed"
                  width={64}
                  height={64}
                  alt={templateUploadedFile.name}
                  src={uploadPreview}
                />
              )}
            </PreviewImageContainer>
            <FilenameInfo>
              <FileNameText>{templateUploadedFile.name}</FileNameText>
              <FileSize>
                {(templateUploadedFile.size / 1000).toFixed(2)} kb
              </FileSize>
            </FilenameInfo>
          </ImageInfo>
          <RemovePreviewIcon
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              setTemplateUploadedFile(null);
              setUploadPreview('');
            }}>
            <CloseIcon />
          </RemovePreviewIcon>
        </Preview>
      ) : isDragActive ? (
        <>
          <UploadIcon />
          <FileTypeDescription>{LG_FILE_UPLOAD_TYPES_TEXT}</FileTypeDescription>
        </>
      ) : (
        <>
          <FileTypeDescription>{LG_FILE_UPLOAD_TYPES_TEXT}</FileTypeDescription>
          {uploadError ? <UploadError>{uploadError}</UploadError> : null}
          <UploadButton role="button">Choose file</UploadButton>
        </>
      )}
    </Container>
  );
};

export default DragDropFileUploadLg;
