import { ConnectWallet } from '@proton/web-sdk';
import { LinkSession, Link } from '@proton/link';
import logoUrl from '../public/logo.svg';

export interface User {
  actor: string;
  avatar: string;
  name: string;
  isLightKYCVerified: boolean;
  permission: string;
}

interface TransferOptions {
  sender: string;
  recipient: string;
  asset_id: string;
  memo?: string;
}

interface BurnOptions {
  owner: string;
  asset_id: string;
}

interface CreateCollectionOptions {
  author: string;
  description: string;
  display_name: string;
  market_fee: string;
  collection_name?: string;
  collection_image?: string;
}

interface SetMarketFeeOptions {
  author: string;
  collection_name: string;
  market_fee: string;
}

interface CreateSaleOptions {
  seller: string;
  asset_id: string;
  price: string;
  currency: string;
}

interface CreateMultipleSalesOptions
  extends Omit<CreateSaleOptions, 'asset_id'> {
  assetIds: string[];
}

interface PurchaseSaleOptions {
  buyer: string;
  amount: string;
  sale_id: string;
}

interface SaleOptions {
  actor: string;
  sale_id: string;
}

interface CancelMultipleSalesOptions {
  actor: string;
  saleIds: string[];
}

interface DepositWithdrawOptions {
  actor: string;
  amount: string;
}

interface Response {
  success: boolean;
  transactionId?: string;
  error?: string;
}

interface WalletResponse {
  user: User;
  error: string;
}

class ProtonSDK {
  chainId: string;
  endpoints: string[];
  appName: string;
  requestAccount: string;
  session: LinkSession | null;
  link: Link | null;

  constructor() {
    this.chainId = process.env.NEXT_PUBLIC_CHAIN_ID;
    this.endpoints = [process.env.NEXT_PUBLIC_CHAIN_ENDPOINT];
    this.appName = 'Monster NFTs';
    this.requestAccount = 'monsters';
    this.session = null;
    this.link = null;
  }

  connect = async ({ restoreSession }): Promise<void> => {
    const { link, session } = await ConnectWallet({
      linkOptions: {
        chainId: this.chainId,
        endpoints: this.endpoints,
        restoreSession,
      },
      transportOptions: {
        requestAccount: this.requestAccount,
        backButton: true,
      },
      selectorOptions: {
        appName: this.appName,
        appLogo: logoUrl as string,
      },
    });
    this.link = link;
    this.session = session;
  };

  login = async (): Promise<WalletResponse> => {
    try {
      await this.connect({ restoreSession: false });
      if (!this.session || !this.session.auth || !this.session.accountData) {
        throw new Error('An error has occurred while logging in');
      }
      const { auth, accountData } = this.session;
      const { avatar, isLightKYCVerified, name } = accountData[0];
      const chainAccountAvatar = avatar
        ? `data:image/jpeg;base64,${avatar}`
        : '/default-avatar.png';

      return {
        user: {
          actor: auth.actor,
          avatar: chainAccountAvatar,
          isLightKYCVerified,
          name,
          permission: auth.permission,
        },
        error: '',
      };
    } catch (e) {
      return {
        user: null,
        error: e.message || 'An error has occurred while logging in',
      };
    }
  };

  logout = async () => {
    await this.link.removeSession(this.requestAccount, this.session.auth);
  };

  restoreSession = async () => {
    try {
      await this.connect({ restoreSession: true });
      if (!this.session || !this.session.auth || !this.session.accountData) {
        throw new Error('An error has occurred while restoring a session');
      }

      const { auth, accountData } = this.session;
      const { avatar, isLightKYCVerified, name } = accountData[0];
      const chainAccountAvatar = avatar
        ? `data:image/jpeg;base64,${avatar}`
        : '/default-avatar.png';

      return {
        user: {
          actor: auth.actor,
          avatar: chainAccountAvatar,
          isLightKYCVerified,
          name,
          permission: auth.permission,
        },
        error: '',
      };
    } catch (e) {
      return {
        user: null,
        error: e.message || 'An error has occurred while restoring a session',
      };
    }
  };

  /**
   * Transfer an asset to another user
   *
   * @param {string}   sender       Chain account of the asset's current owner.
   * @param {string}   recipient    Chain account of recipient of asset to transfer
   * @param {string}   asset_id     ID of the asset being transferred
   * @param {string}   memo         Message to send with transfer
   * @return {Response}             Returns an object indicating the success of the transaction and transaction ID.
   */

  transfer = async ({
    sender,
    recipient,
    asset_id,
    memo,
  }: TransferOptions): Promise<Response> => {
    const action = [
      {
        account: 'atomicassets',
        name: 'transfer',
        authorization: [
          {
            actor: sender,
            permission: 'active',
          },
        ],
        data: {
          from: sender,
          to: recipient,
          asset_ids: [asset_id],
          memo: memo || '',
        },
      },
    ];
    try {
      if (!this.session) {
        throw new Error('Must be logged in to transfer an asset');
      }

      const result = await this.session.transact(
        { actions: action },
        { broadcast: true }
      );

      return {
        success: true,
        transactionId: result.processed.id,
      };
    } catch (e) {
      return {
        success: false,
        error:
          e.message ||
          'An error has occured while attempting to transfer the asset',
      };
    }
  };

  /**
   * Burn an asset (deletes the asset permanently). If there previously were core tokens backed for this asset, these core tokens are transferred to owner.
   *
   * @param {string}   owner         Chain account of the asset's current owner.
   * @param {string}   asset_id     ID of the asset being transferred
   * @return {Response}             Returns an object indicating the success of the transaction and transaction ID.
   */

  burn = async ({ owner, asset_id }: BurnOptions): Promise<Response> => {
    const action = [
      {
        account: 'atomicassets',
        name: 'burnasset',
        authorization: [
          {
            actor: owner,
            permission: 'active',
          },
        ],
        data: {
          asset_owner: owner,
          asset_id,
        },
      },
    ];
    try {
      if (!this.session) {
        throw new Error('Must be logged in to burn an asset');
      }

      const result = await this.session.transact(
        { actions: action },
        { broadcast: true }
      );

      return {
        success: true,
        transactionId: result.processed.id,
      };
    } catch (e) {
      return {
        success: false,
        error:
          e.message ||
          'An error has occurred while attempting to burn the asset',
      };
    }
  };

  /**
   * Withdraw tokens from the marketplace back into user's account
   *
   * @param {string}   actor                chainAccount of user
   * @param {string}   amount               amount of FOOBAR (will only be using FOOBAR in this demo, i.e 1.000000 FOOBAR)
   * @return {Response}      Returns an object indicating the success of the transaction and transaction ID.
   */

  withdraw = async ({
    actor,
    amount,
  }: DepositWithdrawOptions): Promise<Response> => {
    const action = [
      {
        account: 'atomicmarket',
        name: 'withdraw',
        authorization: [
          {
            actor: actor,
            permission: 'active',
          },
        ],
        data: {
          owner: actor,
          token_to_withdraw: amount,
        },
      },
    ];
    try {
      if (!this.session) {
        throw new Error('Must be logged in to withdraw from the market');
      }

      const result = await this.session.transact(
        { actions: action },
        { broadcast: true }
      );

      return {
        success: true,
        transactionId: result.processed.id,
      };
    } catch (e) {
      return {
        success: false,
        error:
          e.message ||
          'An error has occured while attempting to withdraw from the market',
      };
    }
  };

  /**
   * Create a collection on Atomic Assets.
   *
   * @param {string}   author             Chain account of the collection's author.
   * @param {string}   collection_name    Name of the collection on the blockchain.
   * @param {string}   description        Short description of the collection.
   * @param {string}   display_name       Display name of the collection.
   * @param {string}   market_fee         Royalty amount owner receives for each asset transaction within the collection.
   * @param {string}   collection_image   IPFS CID (image hash generated on IPFS).
   * @return {Response}                   Returns an object indicating the success of the transaction and transaction ID.
   */

  createCollection = async ({
    author,
    collection_name,
    description,
    market_fee,
    display_name,
    collection_image,
  }: CreateCollectionOptions): Promise<Response> => {
    const actions = [
      {
        account: 'atomicassets',
        name: 'createcol',
        authorization: [
          {
            actor: author,
            permission: 'active',
          },
        ],
        data: {
          author,
          collection_name: collection_name || author,
          allow_notify: true,
          authorized_accounts: [author],
          notify_accounts: [],
          market_fee,
          data: [
            {
              key: 'description',
              value: ['string', description],
            },
            {
              key: 'name',
              value: ['string', display_name],
            },
            {
              key: 'img',
              value: ['string', collection_image],
            },
          ],
        },
      },
    ];

    try {
      if (!this.session) {
        throw new Error('Unable to create a collection without logging in.');
      }

      const result = await this.session.transact(
        { actions: actions },
        { broadcast: true }
      );

      return {
        success: true,
        transactionId: result.processed.id,
      };
    } catch (e) {
      return {
        success: false,
        error:
          e.message || 'An error has occurred while creating the collection.',
      };
    }
  };

  /**
   * Set a collection's market fee on Atomic Assets.
   *
   * @param {string}   author             Chain account of the collection's author.
   * @param {string}   collection_name    Name of the collection to update.
   * @param {string}   market_fee         Royalty amount owner receives for each asset transaction within the collection.
   * @return {Response}                   Returns an object indicating the success of the transaction and transaction ID.
   */
  setMarketFee = async ({
    author,
    collection_name,
    market_fee,
  }: SetMarketFeeOptions): Promise<Response> => {
    const actions = [
      {
        account: 'atomicassets',
        name: 'setmarketfee',
        authorization: [
          {
            actor: author,
            permission: 'active',
          },
        ],
        data: {
          author,
          collection_name,
          market_fee,
        },
      },
    ];
    try {
      if (!this.session) {
        throw new Error('Unable to set a market fee without logging in.');
      }
      const result = await this.session.transact(
        { actions: actions },
        { broadcast: true }
      );
      return {
        success: true,
        transactionId: result.processed.id,
      };
    } catch (e) {
      return {
        success: false,
        error:
          e.message || 'An error has occurred while setting the market fee.',
      };
    }
  };

  /**
   * Announce an asset sale and create an initial offer for the asset on atomic market.
   *
   * @param {string}   seller     Chain account of the asset's current owner.
   * @param {string}   asset_id   ID of the asset to sell.
   * @param {string}   price      Listing price of the sale (i.e. '1.000000').
   * @param {string}   currency   Token precision (number of decimal points) and token symbol that the sale will be paid in (i.e. '6,FOOBAR').
   * @return {Response}       Returns an object indicating the success of the transaction and transaction ID.
   */

  createSale = async ({
    seller,
    asset_id,
    price,
    currency,
  }: CreateSaleOptions): Promise<Response> => {
    const actions = [
      {
        account: 'atomicmarket',
        name: 'announcesale',
        authorization: [
          {
            actor: seller,
            permission: 'active',
          },
        ],
        data: {
          seller,
          asset_ids: [asset_id],
          maker_marketplace: 'fees.market',
          listing_price: price,
          settlement_symbol: currency,
        },
      },
      {
        account: 'atomicassets',
        name: 'createoffer',
        authorization: [
          {
            actor: seller,
            permission: 'active',
          },
        ],
        data: {
          sender: seller,
          recipient: 'atomicmarket',
          sender_asset_ids: [asset_id],
          recipient_asset_ids: [],
          memo: 'sale',
        },
      },
    ];

    try {
      if (!this.session) {
        throw new Error('Unable to create a sale offer without logging in.');
      }

      const result = await this.session.transact(
        { actions: actions },
        { broadcast: true }
      );

      return {
        success: true,
        transactionId: result.processed.id,
      };
    } catch (e) {
      return {
        success: false,
        error:
          e.message || 'An error has occurred while creating the sale offer.',
      };
    }
  };

  /**
   * Announce multiple asset sales and create initial offers for the assets on atomic market.
   *
   * @param {string}   seller     Chain account of the asset's current owner.
   * @param {string[]} assetIds   Array of IDs for the assets to sell.
   * @param {string}   price      Listing price of the sale (i.e. '1.000000').
   * @param {string}   currency   Token precision (number of decimal points) and token symbol that the sale will be paid in (i.e. '6,FOOBAR').
   * @return {Response}       Returns an object indicating the success of the transaction and transaction ID.
   */

  createMultipleSales = async ({
    seller,
    assetIds,
    price,
    currency,
  }: CreateMultipleSalesOptions): Promise<Response> => {
    const announceSaleActions = assetIds.map((asset_id) => ({
      account: 'atomicmarket',
      name: 'announcesale',
      authorization: [
        {
          actor: seller,
          permission: 'active',
        },
      ],
      data: {
        seller,
        asset_ids: [asset_id],
        maker_marketplace: 'fees.market',
        listing_price: price,
        settlement_symbol: currency,
      },
    }));

    const createOfferActions = assetIds.map((asset_id) => ({
      account: 'atomicassets',
      name: 'createoffer',
      authorization: [
        {
          actor: seller,
          permission: 'active',
        },
      ],
      data: {
        sender: seller,
        recipient: 'atomicmarket',
        sender_asset_ids: [asset_id],
        recipient_asset_ids: [],
        memo: 'sale',
      },
    }));

    const actions = [...announceSaleActions, ...createOfferActions];

    try {
      if (!this.session) {
        throw new Error('Unable to create a sale offer without logging in.');
      }

      const result = await this.session.transact(
        { actions: actions },
        { broadcast: true }
      );

      return {
        success: true,
        transactionId: result.processed.id,
      };
    } catch (e) {
      return {
        success: false,
        error:
          e.message || 'An error has occurred while creating the sale offer.',
      };
    }
  };

  /**
   * Cancel the announcement of an asset sale and its initial offer on atomic market.
   *
   * @param {string}   actor     Chain account of the asset's current owner.
   * @param {string}   sale_id   ID of the sale to cancel.
   * @return {Response}      Returns an object indicating the success of the transaction and transaction ID.
   */

  cancelSale = async ({ actor, sale_id }: SaleOptions): Promise<Response> => {
    const actions = [
      {
        account: 'atomicmarket',
        name: 'cancelsale',
        authorization: [
          {
            actor,
            permission: 'active',
          },
        ],
        data: {
          sale_id,
        },
      },
    ];

    try {
      if (!this.session) {
        throw new Error('Unable to cancel a sale without logging in.');
      }

      const result = await this.session.transact(
        { actions: actions },
        { broadcast: true }
      );

      return {
        success: true,
        transactionId: result.processed.id,
      };
    } catch (e) {
      return {
        success: false,
        error: e.message || 'An error has occurred while cancelling the sale.',
      };
    }
  };

  /**
   * Cancel the announcements of several asset sales and their initial offers on atomic market.
   *
   * @param {string}   actor      Chain account of the asset's current owner.
   * @param {string[]} saleIds    Array of IDs for the sales to cancel.
   * @return {Response}       Returns an object indicating the success of the transaction and transaction ID.
   */

  cancelMultipleSales = async ({
    actor,
    saleIds,
  }: CancelMultipleSalesOptions): Promise<Response> => {
    const actions = saleIds.map((sale_id) => ({
      account: 'atomicmarket',
      name: 'cancelsale',
      authorization: [
        {
          actor,
          permission: 'active',
        },
      ],
      data: {
        sale_id,
      },
    }));

    try {
      if (!this.session) {
        throw new Error('Unable to cancel a sale without logging in.');
      }

      const result = await this.session.transact(
        { actions: actions },
        { broadcast: true }
      );

      return {
        success: true,
        transactionId: result.processed.id,
      };
    } catch (e) {
      return {
        success: false,
        error: e.message || 'An error has occurred while cancelling the sale.',
      };
    }
  };

  purchaseSale = async ({
    buyer,
    amount,
    sale_id,
  }: PurchaseSaleOptions): Promise<Response> => {
    const actions = [
      {
        account: 'xtokens',
        name: 'transfer',
        authorization: [
          {
            actor: buyer,
            permission: 'active',
          },
        ],
        data: {
          from: buyer,
          to: 'atomicmarket',
          quantity: amount,
          memo: 'deposit',
        },
      },
      {
        account: 'atomicmarket',
        name: 'purchasesale',
        authorization: [
          {
            actor: buyer,
            permission: 'active',
          },
        ],
        data: {
          sale_id,
          buyer,
          intended_delphi_median: 0,
          taker_marketplace: 'fees.market',
        },
      },
    ];
    try {
      if (!this.session) {
        throw new Error('Unable to purchase a sale without logging in.');
      }

      const result = await this.session.transact(
        { actions: actions },
        { broadcast: true }
      );

      return {
        success: true,
        transactionId: result.processed.id,
      };
    } catch (e) {
      const message = e.message[0].toUpperCase() + e.message.slice(1);
      return {
        success: false,
        error:
          message || 'An error has occurred while trying to purchase an item.',
      };
    }
  };
}

export default new ProtonSDK();
