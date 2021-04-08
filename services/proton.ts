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

interface CreateCollectionSchemaTemplateOptions {
  author: string;
  description: string;
  display_name: string;
  template_name: string;
  template_description: string;
  edition_size: number;
  collection_name?: string;
  collection_image?: string;
  template_image?: string;
}

interface CreateCollectionAndSchemaOptions {
  author: string;
  description: string;
  display_name: string;
  collection_name?: string;
  collection_image?: string;
}

interface CreateTemplateOptions {
  author: string;
  collection_name: string;
  template_name: string;
  description: string;
  edition_size: number;
  template_image?: string;
}

interface MintAssetsOptions {
  author: string;
  collection_name: string;
  template_id: string;
  mint_amount: number;
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

interface CreateTemplateResponse extends Response {
  templateId: string;
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
   * @param {string}   collection_image   IPFS CID (image hash generated on IPFS).
   * @return {Response}                   Returns an object indicating the success of the transaction and transaction ID.
   */

  createCollectionAndSchema = async ({
    author,
    collection_name,
    description,
    display_name,
    collection_image,
  }: CreateCollectionAndSchemaOptions): Promise<Response> => {
    const name = collection_name || author;
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
          collection_name: name,
          allow_notify: true,
          authorized_accounts: [author],
          notify_accounts: [],
          market_fee: '0.000000',
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
      {
        account: 'atomicassets',
        name: 'createschema',
        authorization: [
          {
            actor: author,
            permission: 'active',
          },
        ],
        data: {
          authorized_creator: author,
          collection_name: name,
          schema_name: name,
          schema_format: [
            { name: 'series', type: 'uint16' },
            { name: 'image', type: 'image' },
            { name: 'name', type: 'string' },
            { name: 'desc', type: 'string' },
          ],
        },
      },
    ];

    try {
      if (!this.session) {
        throw new Error(
          'Unable to create a collection and schema without logging in.'
        );
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
          e.message ||
          'An error has occurred while creating the collection and schema.',
      };
    }
  };

  /**
   * Create a collection and a template on Atomic Assets.
   *
   * @param {string}   author             Chain account of the collection's author.
   * @param {string}   collection_name    Name of the collection on the blockchain.
   * @param {string}   description        Short description of the collection.
   * @param {string}   display_name       Display name of the collection.
   * @param {string}   collection_image   IPFS CID (image hash generated on IPFS).
   * @return {Response}                   Returns an object indicating the success of the transaction and transaction ID.
   */

  createCollectionSchemaTemplate = async ({
    author,
    collection_name,
    description,
    display_name,
    collection_image,
    template_name,
    template_image,
    template_description,
    edition_size,
  }: CreateCollectionSchemaTemplateOptions): Promise<CreateTemplateResponse> => {
    const name = collection_name || author;
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
          collection_name: name,
          allow_notify: true,
          authorized_accounts: [author],
          notify_accounts: [],
          market_fee: '0.000000',
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
      {
        account: 'atomicassets',
        name: 'createschema',
        authorization: [
          {
            actor: author,
            permission: 'active',
          },
        ],
        data: {
          authorized_creator: author,
          collection_name: name,
          schema_name: name,
          schema_format: [
            { name: 'series', type: 'uint16' },
            { name: 'image', type: 'image' },
            { name: 'name', type: 'string' },
            { name: 'desc', type: 'string' },
          ],
        },
      },
      {
        account: 'atomicassets',
        name: 'createtempl',
        authorization: [
          {
            actor: author,
            permission: 'active',
          },
        ],
        data: {
          authorized_creator: author,
          collection_name: name,
          schema_name: name,
          transferable: true,
          burnable: true,
          max_supply: edition_size,
          immutable_data: [
            { key: 'series', value: ['uint16', '1'] },
            {
              key: 'image',
              value: ['string', template_image],
            },
            { key: 'name', value: ['string', template_name] },
            { key: 'desc', value: ['string', template_description] },
          ],
        },
      },
    ];

    try {
      if (!this.session) {
        throw new Error(
          'Unable to create a collection, schema, and template without logging in.'
        );
      }

      const result = await this.session.transact(
        { actions: actions },
        { broadcast: true }
      );

      const templateActionTrace = result.processed.action_traces[2];
      const [inlineTrace] = templateActionTrace
        ? templateActionTrace.inline_traces
        : [];

      if (!templateActionTrace) {
        throw new Error('An error has occurred while creating the template.');
      }

      const templateId: string = inlineTrace.act.data.template_id;

      return {
        success: true,
        templateId,
        transactionId: result.processed.id,
      };
    } catch (e) {
      return {
        success: false,
        templateId: '',
        error:
          e.message ||
          'An error has occurred while creating the collection, schema, and template.',
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
   * Create a collection template on Atomic Assets.
   *
   * @param {string}   author             Chain account of the collection's author.
   * @param {string}   collection_name    Name of the collection on the blockchain.
   * @param {string}   template_name      Name of the template to create.
   * @param {string}   template_image     IPFS CID (image hash generated on IPFS).
   * @param {string}   description        Description of the template.
   * @return {Response}                   Returns an object indicating the success of the transaction and transaction ID.
   */

  createTemplate = async ({
    author,
    collection_name,
    template_name,
    template_image,
    description,
    edition_size,
  }: CreateTemplateOptions): Promise<CreateTemplateResponse> => {
    const actions = [
      {
        account: 'atomicassets',
        name: 'createtempl',
        authorization: [
          {
            actor: author,
            permission: 'active',
          },
        ],
        data: {
          authorized_creator: author,
          collection_name,
          schema_name: collection_name,
          transferable: true,
          burnable: true,
          max_supply: edition_size,
          immutable_data: [
            { key: 'series', value: ['uint16', '1'] },
            {
              key: 'image',
              value: ['string', template_image],
            },
            { key: 'name', value: ['string', template_name] },
            { key: 'desc', value: ['string', description] },
          ],
        },
      },
    ];
    try {
      if (!this.session) {
        throw new Error('Unable to create a template without logging in.');
      }
      const result = await this.session.transact(
        { actions: actions },
        { broadcast: true }
      );

      const [actionTrace] = result.processed.action_traces;
      const [inlineTrace] = actionTrace ? actionTrace.inline_traces : [];

      if (!inlineTrace) {
        throw new Error('An error has occurred while creating the template.');
      }

      const templateId: string = inlineTrace.act.data.template_id;
      return {
        success: true,
        templateId,
        transactionId: result.processed.id,
      };
    } catch (e) {
      return {
        success: false,
        templateId: '',
        error:
          e.message || 'An error has occurred while creating the template.',
      };
    }
  };

  /**
   * Mint template assets on Atomic Assets.
   *
   * @param {string}   author               Chain account of the collection's author.
   * @param {string}   collection_name      Name of the collection on the blockchain.
   * @param {string}   template_id          ID of the asset's template type.
   * @param {number}   mint_amount          Number of assets to mint.
   * @return {Response}                     Returns an object indicating the success of the transaction and transaction ID.
   */

  mintAssets = async ({
    author,
    collection_name,
    template_id,
    mint_amount,
  }: MintAssetsOptions): Promise<Response> => {
    const generateMintAssetAction = () => ({
      account: 'atomicassets',
      name: 'mintasset',
      authorization: [
        {
          actor: author,
          permission: 'active',
        },
      ],
      data: {
        authorized_minter: author,
        collection_name: collection_name,
        schema_name: collection_name,
        template_id,
        new_asset_owner: author,
        immutable_data: [],
        mutable_data: [],
        tokens_to_back: [],
      },
    });

    const actions = Array.from({ length: mint_amount }, () =>
      generateMintAssetAction()
    );

    try {
      if (!this.session) {
        throw new Error('Unable to mint assets without logging in.');
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
        error: e.message || 'An error has occurred while minting the assets.',
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
