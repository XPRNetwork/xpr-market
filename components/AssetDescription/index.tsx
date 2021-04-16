import { useState } from 'react';
import { Description, More } from './AssetDescription.styled';

type Props = {
  description: string;
};

const MAX_DESCRIPTION_LENGTH = 170;

export const AssetDescription = ({ description }: Props): JSX.Element => {
  const words = description.split(' ');
  const [isDescriptionActive, setIsDescriptionActive] = useState(false);

  const getDescriptionSnippet = () => {
    if (description.length <= MAX_DESCRIPTION_LENGTH) {
      return description;
    }

    let maxCharacters = MAX_DESCRIPTION_LENGTH;
    for (let index = 0; index < words.length; index++) {
      const word = words[index];
      maxCharacters -= word.length + 1;

      if (maxCharacters < 0) {
        return words.slice(0, index).join(' ');
      }
    }
  };

  const descriptionSnippet = getDescriptionSnippet();
  const [renderedDescription, setRenderedDescription] = useState(
    descriptionSnippet
  );

  const handleDescription = () => {
    if (!isDescriptionActive) {
      setIsDescriptionActive(true);
      setRenderedDescription(description);
      return;
    }
    setIsDescriptionActive(false);
    setRenderedDescription(descriptionSnippet);
  };

  return (
    <Description>
      {renderedDescription}
      {description.length > MAX_DESCRIPTION_LENGTH ? (
        <>
          {isDescriptionActive ? ' ' : '... '}
          <More onClick={handleDescription}>
            {isDescriptionActive ? 'Read less' : 'Read more'}
          </More>
        </>
      ) : (
        ''
      )}
    </Description>
  );
};

export default AssetDescription;
