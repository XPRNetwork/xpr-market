import React, { useState } from 'react';
import DragDropFileUploadLg from '../components/DragDropFileUploadLg';

const Create = (): JSX.Element => {
  const [templateUploadedFile, setTemplateUploadedFile] = useState<File | null>(
    null
  );

  const templatePreviewSrc = templateUploadedFile
    ? URL.createObjectURL(templateUploadedFile)
    : '/placeholder-template-image.png';

  return (
    <>
    <br /><br /><br /><br /><br /><br /><br />
      <DragDropFileUploadLg setTemplateUploadedFile={setTemplateUploadedFile} />
      <img src={templatePreviewSrc} width="225" height="225" alt="preview" />
    </>
  );
};

export default Create;
