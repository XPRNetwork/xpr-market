import { Dispatch, SetStateAction } from 'react';
import Button from '../Button';
import AssetDescription from '../AssetDescription';
import {
  DropdownMenu,
  General,
  Amount,
  Row,
  FeeLabel,
} from '../AssetFormBuy/AssetFormBuy.styled';
import { Asset } from '../../services/assets';

type Props = {
  description: string;
  dropdownAssets: Asset[];
  lowestPrice: string;
  maxSupply: string;
  buttonText: string;
  assetId: string;
  listingSaleFee?: string;
  handleButtonClick: () => void;
  setCurrentAsset: Dispatch<SetStateAction<Asset>>;
};

export const AssetFormSell = ({
  description,
  dropdownAssets,
  lowestPrice,
  maxSupply,
  buttonText,
  assetId,
  listingSaleFee,
  handleButtonClick,
  setCurrentAsset,
}: Props): JSX.Element => {
  const handleDropdownSelect = (id: string) => {
    const dropdownAsset = dropdownAssets.find((asset) => {
      return asset.asset_id === id;
    });
    setCurrentAsset(dropdownAsset);
  };

  return (
    <>
      {description ? <AssetDescription description={description} /> : ''}
      <Row>
        <General>Lowest Market Price</General>
        <General>Edition Size</General>
      </Row>
      <Row>
        <Amount>{lowestPrice || 'None'}</Amount>
        <Amount>{maxSupply === '0' ? 'Unlimited' : maxSupply}</Amount>
      </Row>
      <General>Serial number</General>
      <DropdownMenu
        name="Available Assets For Sale"
        value={assetId}
        onChange={(e) => handleDropdownSelect(e.target.value)}>
        <option key="blank" value="" disabled>
          - - Select a serial number - -
        </option>
        {dropdownAssets.length > 0 &&
          dropdownAssets.map(({ asset_id, template_mint, salePrice }) => (
            <option key={template_mint} value={asset_id}>
              #{template_mint} - {salePrice || 'Not for sale'}
            </option>
          ))}
      </DropdownMenu>
      {listingSaleFee && (
        <FeeLabel>
          <span>Listing Fee</span>
          <span>{listingSaleFee}</span>
        </FeeLabel>
      )}
      <Button
        cancel={buttonText.toLowerCase().includes('cancel')}
        fullWidth
        onClick={handleButtonClick}>
        {buttonText}
      </Button>
    </>
  );
};

export default AssetFormSell;
