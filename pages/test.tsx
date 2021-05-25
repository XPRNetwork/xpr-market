import { useState } from 'react';
import PageLayout from '../components/PageLayout';
import ProtonSDK from '../services/proton';
import { getAllAuctionsBySeller } from '../services/auctions';

const Test = (): JSX.Element => {
  const [assetId, setAssetId] = useState('');
  const [startingBid, setStartingBid] = useState('');
  const [auctionDuration, setAuctionDuration] = useState('');
  const [bid, setBid] = useState('');
  const [auctionId, setAuctionId] = useState('');
  const [seller, setSeller] = useState('');

  const createAuction = async () => {
    const res = await ProtonSDK.createAuction({
      asset_id: assetId,
      starting_bid: startingBid,
      duration: auctionDuration,
    });
    console.log('createAuction: ', res);
  };

  const bidOnAuction = async () => {
    const res = await ProtonSDK.bidOnAuction({
      auction_id: auctionId,
      bid,
    });
    console.log('bidOnAuction: ', res);
  };

  const claimAuctionAsSeller = async () => {
    const res = await ProtonSDK.claimAuctionSell({
      auction_id: auctionId,
    });
    console.log('claimAuctionAsSeller: ', res);
  };

  const claimAuctionAsBidder = async () => {
    const res = await ProtonSDK.claimAuctionBuy({
      auction_id: auctionId,
    });
    console.log('claimAuctionAsBidder: ', res);
  };

  const cancelAuction = async () => {
    const res = await ProtonSDK.cancelAuction({
      auction_id: auctionId,
    });
    console.log('cancelAuction: ', res);
  };

  const getAllAuctions = async () => {
    const auctions = await getAllAuctionsBySeller(seller);
    console.log(`getAllAuctions by ${seller}: `, auctions);
  };

  return (
    <PageLayout title="Test">
      <br />
      <br />
      <input
        placeholder="Seller"
        value={seller}
        onChange={(e) => setSeller(e.target.value)}
      />
      <button onClick={getAllAuctions}>Get Auctions (console log)</button>
      <br />
      <br />
      1. Seller creates an auction
      <input
        placeholder="Asset ID"
        value={assetId}
        onChange={(e) => setAssetId(e.target.value)}
      />
      <input
        placeholder="Starting Bid (ex: 1.000000 XUSDC)"
        value={startingBid}
        onChange={(e) => setStartingBid(e.target.value)}
      />
      <input
        placeholder="Auction Duration"
        value={auctionDuration}
        onChange={(e) => setAuctionDuration(e.target.value)}
      />
      <button onClick={createAuction}>Create Auction</button>
      <br />
      <br />
      2. Bidder makes bid on auction
      <input
        placeholder="Auction ID"
        value={auctionId}
        onChange={(e) => setAuctionId(e.target.value)}
      />
      <input
        placeholder="Bid (ex: 1.000000 XUSDC)"
        value={bid}
        onChange={(e) => setBid(e.target.value)}
      />
      <button onClick={bidOnAuction}>Bid on Auction</button>
      <br />
      <br />
      3. Seller finishes auction with ProtonSDK.claimAuctionAsSeller
      <input
        placeholder="Auction ID"
        value={auctionId}
        onChange={(e) => setAuctionId(e.target.value)}
      />
      <button onClick={claimAuctionAsSeller}>Finish Auction (Seller)</button>
      <br />
      <br />
      4. Buyer finishes auction with ProtonSDK.claimAuctionAsBuyer
      <input
        placeholder="Auction ID"
        value={auctionId}
        onChange={(e) => setAuctionId(e.target.value)}
      />
      <button onClick={claimAuctionAsBidder}>Finish Auction (Buyer)</button>
      <br />
      <br />
      (Optional) Cancel an auction
      <input
        placeholder="Auction ID"
        value={auctionId}
        onChange={(e) => setAuctionId(e.target.value)}
      />
      <button onClick={cancelAuction}>Cancel Auction</button>
    </PageLayout>
  );
};

export default Test;
