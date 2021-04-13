import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { CarouselProvider, Slider, Slide } from 'pure-react-carousel';
import CollectionBox from '../CollectionBox';
import { ReactComponent as Arrow } from '../../public/chevron-right.svg';
import { Collection } from '../../services/collections';
import Image from 'next/image';
import { useModalContext, MODAL_TYPES } from '../Provider';
import {
  BoxButton,
  CarouselContainer,
  ChooseCollectionContainer,
  ButtonNext,
  ButtonBack,
  TryAgainButton,
} from './CollectionsCarousel.styled';
import Spinner from '../Spinner';

type CollectionsCarouselProps = {
  collections: Collection[];
  error?: string;
  isLoading: boolean;
  getUserCollections: () => Promise<void>;
  setCollectionName: Dispatch<SetStateAction<string>>;
  setCollectionImage: Dispatch<SetStateAction<string>>;
};

const CollectionsCarousel = ({
  collections,
  error,
  isLoading,
  getUserCollections,
  setCollectionImage,
  setCollectionName,
}: CollectionsCarouselProps): JSX.Element => {
  const { openModal, setModalProps } = useModalContext();
  const [activeCollection, setActiveCollection] = useState<string>('');
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [slideStep] = useState<number>(3);
  const [totalSlides, setTotalSlides] = useState<number>(
    collections.length + 1
  );

  const createCollection = () => {
    openModal(MODAL_TYPES.CREATE_COLLECTION);
    setModalProps({
      fetchPageData: getUserCollections,
      setCollectionImage: setCollectionImage,
      setCollectionName: setCollectionName,
      setActiveCollection: setActiveCollection,
    });
  };

  const selectCollection = (collection: Collection) => {
    const { collection_name, img } = collection;
    setActiveCollection(collection_name);
    setCollectionName(collection_name);
    setCollectionImage(img);
  };

  const onClickForward = () => {
    const totalSlides = collections.length + 1;
    const nextSlide = currentSlide + slideStep;
    const maxSlide = totalSlides - slideStep;
    if (nextSlide > maxSlide) {
      setCurrentSlide(maxSlide);
    } else {
      setCurrentSlide(currentSlide + slideStep);
    }
  };

  const onClickBackward = () => {
    const nextSlide = currentSlide - slideStep;
    if (nextSlide < 0) {
      setCurrentSlide(0);
    } else {
      setCurrentSlide(nextSlide);
    }
  };

  useEffect(() => {
    setTotalSlides(collections.length + 1);
  }, [collections]);

  const getContent = () => {
    if (isLoading) {
      return (
        <ChooseCollectionContainer>
          <Spinner />
        </ChooseCollectionContainer>
      );
    } else if (error) {
      return (
        <ChooseCollectionContainer>
          <p>Unable to get collections</p>
          <TryAgainButton onClick={getUserCollections}>
            Try again
          </TryAgainButton>
        </ChooseCollectionContainer>
      );
    } else {
      return (
        <ChooseCollectionContainer>
          <CarouselContainer>
            <CarouselProvider
              totalSlides={totalSlides}
              currentSlide={currentSlide}
              dragEnabled={false}
              naturalSlideHeight={136}
              naturalSlideWidth={144}>
              <Slider>
                <Slide index={0} key={0}>
                  <BoxButton onClick={createCollection}>
                    <Image
                      priority
                      layout="fixed"
                      width={40}
                      height={40}
                      alt="plus icon"
                      src="/plus-icon.png"
                    />
                    <span>Create</span>
                  </BoxButton>
                </Slide>
                {collections.map((collection, i) => (
                  <Slide
                    index={i + 1}
                    key={i + 1}
                    onClick={() => selectCollection(collection)}>
                    <CollectionBox
                      collection={collection}
                      active={collection.collection_name === activeCollection}
                    />
                  </Slide>
                ))}
              </Slider>
              <ButtonBack
                onClick={onClickBackward}
                disabled={currentSlide === 0}>
                <Arrow />
              </ButtonBack>
              <ButtonNext
                onClick={onClickForward}
                disabled={currentSlide >= totalSlides - slideStep}>
                <Arrow />
              </ButtonNext>
            </CarouselProvider>
          </CarouselContainer>
        </ChooseCollectionContainer>
      );
    }
  };

  return getContent();
};

export default CollectionsCarousel;
