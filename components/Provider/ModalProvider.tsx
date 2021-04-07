import {
  useState,
  createContext,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';
import { useScrollLock } from '../../hooks';

export const MODAL_TYPES = {
  HIDDEN: 'HIDDEN',
  CLAIM: 'CLAIM',
  CREATE_SALE: 'CREATE_SALE',
  CREATE_MULTIPLE_SALES: 'CREATE_MULTIPLE_SALES',
  CANCEL_SALE: 'CANCEL_SALE',
  CANCEL_MULTIPLE_SALES: 'CANCEL_MULTIPLE_SALES',
  TRANSFER: 'TRANSFER',
  CREATE_COLLECTION: 'CREATE_COLLECTION',
};

type Props = {
  children: ReactNode;
};

export interface GeneralModalProps {
  fetchPageData: () => Promise<void>;
}

export interface CancelSaleModalProps extends GeneralModalProps {
  saleId: string;
}

export interface CancelMultipleSalesModalProps extends GeneralModalProps {
  saleIds: string[];
}

export interface CreateSaleModalProps extends GeneralModalProps {
  assetId: string;
}

export interface CreateMultipleSalesModalProps extends GeneralModalProps {
  assetIds: string[];
}

export interface TransferNFTModalProps extends GeneralModalProps {
  assetId: string;
  templateMint: string;
}

export interface CreateCollectionProps extends GeneralModalProps {
  setCollectionImage: Dispatch<SetStateAction<string>>;
  setCollectionName: Dispatch<SetStateAction<string>>;
}

type ModalProps =
  | GeneralModalProps
  | CancelSaleModalProps
  | CancelMultipleSalesModalProps
  | CreateSaleModalProps
  | CreateMultipleSalesModalProps
  | TransferNFTModalProps
  | CreateCollectionProps;

type ModalContextValue = {
  modalType: string;
  openModal: (type: string) => void;
  closeModal: () => void;
  modalProps: ModalProps;
  setModalProps: Dispatch<SetStateAction<ModalProps>>;
};

const ModalContext = createContext<ModalContextValue>({
  modalType: MODAL_TYPES.HIDDEN,
  openModal: undefined,
  closeModal: undefined,
  modalProps: undefined,
  setModalProps: () => {},
});

export const useModalContext = (): ModalContextValue => {
  const context = useContext(ModalContext);
  return context;
};

export const ModalProvider = ({ children }: Props): JSX.Element => {
  const [modalType, setModalType] = useState<string>(MODAL_TYPES.HIDDEN);
  const [modalProps, setModalProps] = useState<ModalProps>(undefined);
  const openModal = (type: string) => setModalType(type);
  const closeModal = () => setModalType(MODAL_TYPES.HIDDEN);
  useScrollLock(modalType !== MODAL_TYPES.HIDDEN);

  const value: ModalContextValue = {
    modalType,
    openModal,
    closeModal,
    modalProps,
    setModalProps,
  };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};
