import { useCallback, useState, Dispatch, SetStateAction } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Container,
  FileTypeDescription,
  UploadButton,
  UploadError,
} from './DragDropFileUploadLg.styled';
import {
  LG_FILE_UPLOAD_TYPES_TEXT,
  LG_FILE_UPLOAD_TYPES,
  LG_FILE_SIZE_UPLOAD_LIMIT,
} from '../../utils/constants';
import { ReactComponent as UploadIcon } from '../../public/upload-icon.svg';

type Props = {
  setTemplateUploadedFile: Dispatch<SetStateAction<File>>;
};

const DragDropFileUploadLg = ({
  setTemplateUploadedFile,
}: Props): JSX.Element => {
  const onDrop = useCallback((acceptedFiles) => {
    setUploadError('');
    const file = acceptedFiles[0];
    const isAcceptedFileType = LG_FILE_UPLOAD_TYPES[file.type] || false;
    const isAcceptedFileSize = file.size <= LG_FILE_SIZE_UPLOAD_LIMIT; // 30MB
    if (isAcceptedFileType && isAcceptedFileSize) {
      setTemplateUploadedFile(file);
    } else {
      setUploadError(
        'Unable to upload, please double check your file size or file type.'
      );
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const [uploadError, setUploadError] = useState<string>('');

  return (
    <Container {...getRootProps()} isDragActive={isDragActive}>
      <input
        {...getInputProps()}
        accept="image/png,image/jpg,image/jpeg,image/webp,image/gif,video/mp4,audio/mp3,audio/mpeg,.png,.mp3,.jpg,.jpeg,.webp,.mpeg,.gif,.mp4"
      />
      {isDragActive ? (
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
