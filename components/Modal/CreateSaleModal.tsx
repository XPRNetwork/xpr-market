import {
  useEffect,
  useState,
  MouseEvent,
  Dispatch,
  SetStateAction,
} from 'react';
import {
  useAuthContext,
  useModalContext,
  CreateSaleModalProps,
  CreateMultipleSalesModalProps,
} from '../Provider';
import PriceInput from '../PriceInput';
import {
  Background,
  ModalBox,
  Section,
  CloseIconContainer,
  Title,
  Description,
  HalfButton,
  FeeLabel,
} from './Modal.styled';
import { ReactComponent as CloseIcon } from '../../public/close.svg';
import { calculateFee } from '../../utils';
import {
  TOKEN_SYMBOL,
  TOKEN_PRECISION,
  RAM_COSTS,
  SHORTENED_TOKEN_PRECISION,
} from '../../utils/constants';
import ProtonSDK from '../../services/proton';

type Props = {
  title: string;
  description: string;
  buttonText: string;
  amount: string;
  listingFee: number;
  numSales: number;
  onButtonClick: () => Promise<void>;
  setAmount: Dispatch<SetStateAction<string>>;
  setListingFee: Dispatch<SetStateAction<number>>;
};

const SaleModal = ({
  title,
  description,
  buttonText,
  amount,
  listingFee,
  numSales,
  setAmount,
  onButtonClick,
  setListingFee,
}: Props): JSX.Element => {
  const { closeModal, modalProps } = useModalContext();
  const { accountRam, conversionRate } = modalProps as
    | CreateSaleModalProps
    | CreateMultipleSalesModalProps;

  useEffect(() => {
    const fee = calculateFee({
      numAssets: numSales,
      accountRam,
      ramCost: RAM_COSTS.LIST_SALE,
      conversionRate,
    });
    setListingFee(isNaN(fee) ? 0 : fee);
  }, [numSales, accountRam, conversionRate]);

  const handleBackgroundClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const getFee = () =>
    listingFee && listingFee !== 0 ? (
      <FeeLabel>
        <span>Listing Fee</span>
        <span>{listingFee.toFixed(SHORTENED_TOKEN_PRECISION)} XUSDC</span>
      </FeeLabel>
    ) : null;

  return (
    <Background onClick={handleBackgroundClick}>
      <ModalBox>
        <Section>
          <Title>{title}</Title>
          <CloseIconContainer role="button" onClick={closeModal}>
            <CloseIcon />
          </CloseIconContainer>
        </Section>
        <Description>{description}</Description>
        <PriceInput
          amount={amount}
          setAmount={setAmount}
          submit={onButtonClick}
          placeholder={`Enter amount in ${TOKEN_SYMBOL}`}
        />
        {getFee()}
        <HalfButton
          margin={listingFee !== 0 ? '0' : '24px 0 0'}
          onClick={onButtonClick}>
          {buttonText}
        </HalfButton>
      </ModalBox>
    </Background>
  );
};

export const CreateSaleModal = (): JSX.Element => {
  const { currentUser } = useAuthContext();
  const { closeModal, modalProps } = useModalContext();
  const { assetId, fetchPageData } = modalProps as CreateSaleModalProps;
  const [amount, setAmount] = useState<string>('');
  const [listingFee, setListingFee] = useState<number>(0);

  const createOneSale = async () => {
    try {
      const formattedAmount = parseFloat(amount).toFixed(TOKEN_PRECISION);
      const listing_fee =
        typeof listingFee === 'string'
          ? isNaN(parseFloat(listingFee))
            ? 0
            : parseFloat(listingFee)
          : listingFee;

      const res = await ProtonSDK.createSale({
        seller: currentUser ? currentUser.actor : '',
        asset_id: assetId,
        price: `${formattedAmount} ${TOKEN_SYMBOL}`,
        currency: `${TOKEN_PRECISION},${TOKEN_SYMBOL}`,
        listing_fee,
      });

      if (res.success) {
        closeModal();
        fetchPageData();
      }
    } catch (err) {
      console.warn(err.message);
    }
  };

  return (
    <SaleModal
      numSales={1}
      title="Listing Price"
      description="Enter the amount you want to sell your NFT for."
      buttonText="Mark for sale"
      amount={amount}
      listingFee={listingFee}
      setAmount={setAmount}
      setListingFee={setListingFee}
      onButtonClick={createOneSale}
    />
  );
};

export const CreateMultipleSalesModal = (): JSX.Element => {
  const { currentUser } = useAuthContext();
  const { closeModal, modalProps } = useModalContext();
  const {
    assetIds,
    fetchPageData,
    setIsModalWithFeeOpen,
  } = modalProps as CreateMultipleSalesModalProps;
  const [amount, setAmount] = useState<string>('');
  const [listingFee, setListingFee] = useState<number>(0);
  const numSales = assetIds.length;

  const createMultipleSales = async () => {
    try {
      const formattedAmount = parseFloat(amount).toFixed(TOKEN_PRECISION);
      const listing_fee =
        typeof listingFee === 'string'
          ? isNaN(parseFloat(listingFee))
            ? 0
            : parseFloat(listingFee)
          : listingFee;
      const res = await ProtonSDK.createMultipleSales({
        seller: currentUser ? currentUser.actor : '',
        assetIds,
        price: `${formattedAmount} ${TOKEN_SYMBOL}`,
        currency: `${TOKEN_PRECISION},${TOKEN_SYMBOL}`,
        listing_fee,
      });

      if (res.success) {
        closeModal();
        setIsModalWithFeeOpen(false);
        fetchPageData();
      }
    } catch (err) {
      console.warn(err.message);
    }
  };

  return (
    <SaleModal
      numSales={numSales}
      title="Listing Price"
      description={`You are putting up ${numSales} items for sale. Enter the amount you want to sell each of your NFTs for.`}
      buttonText="Mark all for sale"
      amount={amount}
      listingFee={listingFee}
      setAmount={setAmount}
      setListingFee={setListingFee}
      onButtonClick={createMultipleSales}
    />
  );
};

SaleModal.defaultProps = {
  listingFee: 0,
};
