import { JsonRpc } from '@proton/js';
import { formatPrice } from '../utils';
import {
  TOKEN_SYMBOL,
  TOKEN_CONTRACT,
  EMPTY_BALANCE,
} from '../utils/constants';
import { encodeName } from '@bloks/utils';
import { RpcInterfaces } from '@proton/js';

type User = {
  actor: string;
  avatar: string;
  name: string;
};

export type TeleportFees = {
  chain_id: number;
  port_in_fee: number;
  port_out_fee: number;
}

export type TeleportFeesBalance = {
  owner: string;
  balance: number;
  reserved: number;
}

export type TeleportOutReqs = {
  asset_id: string;
  chain_id: string;
  contract_address: string;
  created_on: string;
  to_address: string;
  token_id: string;
}

class ProtonJs {
  rpc: JsonRpc = null;
  endpoints: string[];

  constructor() {
    this.endpoints = process.env.NEXT_PUBLIC_CHAIN_ENDPOINTS.split(', ');
    this.rpc = new JsonRpc(this.endpoints);
  }

  getAccountBalance = async (chainAccount: string): Promise<string> => {
    const balance = await this.rpc.get_currency_balance(
      TOKEN_CONTRACT,
      chainAccount,
      TOKEN_SYMBOL
    );
    const price = balance.length ? balance[0] : `${0} ${TOKEN_SYMBOL}`;
    return formatPrice(price);
  };

  async getAccountData(chainAccount: string): Promise<RpcInterfaces.UserInfo> {
    const { rows } = await this.rpc.get_table_rows({
      json: true,
      code: 'eosio.proton',
      scope: 'eosio.proton',
      table: 'usersinfo',
      table_key: '',
      key_type: 'i64',
      lower_bound: encodeName(chainAccount, false),
      index_position: 1,
      limit: 1,
    });
    return rows && rows.length && rows[0].acc === chainAccount
      ? rows[0]
      : undefined;
  }

  getUserByChainAccount = async (chainAccount: string): Promise<User> => {
    const { rows } = await this.rpc.get_table_rows({
      scope: 'eosio.proton',
      code: 'eosio.proton',
      json: true,
      table: 'usersinfo',
      lower_bound: chainAccount,
      upper_bound: chainAccount,
    });

    return !rows.length ? '' : rows[0];
  };

  getProfileImage = async (chainAccount: string): Promise<string> => {
    const user = await this.getUserByChainAccount(chainAccount);
    return user.avatar;
  };

  getAtomicMarketBalance = async (chainAccount: string): Promise<string> => {
    try {
      const res = await this.rpc.get_table_rows({
        json: true,
        code: 'atomicmarket',
        scope: 'atomicmarket',
        table: 'balances',
        lower_bound: chainAccount,
        limit: 1,
        reverse: false,
        show_payer: false,
      });

      if (!res.rows.length) {
        throw new Error('No balances found for Atomic Market.');
      }

      const [balance] = res.rows;
      if (
        !balance ||
        balance.owner !== chainAccount ||
        !balance.quantities.length
      ) {
        throw new Error(
          `No Atomic Market balances found for chain account: ${chainAccount}.`
        );
      }

      const [amount] = balance.quantities;
      return amount;
    } catch (err) {
      return EMPTY_BALANCE;
    }
  };

  getAccountRam = async (
    account_name: string
  ): Promise<{
    used: number;
    max: number;
    percent: number;
  }> => {
    try {
      const account = await this.rpc.get_account(account_name);

      if (!account || !account.ram_quota) {
        throw new Error('Unable to find account.');
      }

      return {
        used: account.ram_usage,
        max: account.ram_quota,
        percent: (account.ram_usage / account.ram_quota) * 100,
      };
    } catch (err) {
      console.warn(err);
      return {
        used: 0,
        max: 0,
        percent: 0,
      };
    }
  };

  getSpecialMintContractRam = async (chainAccount: string): Promise<number> => {
    try {
      const res = await this.rpc.get_table_rows({
        json: true,
        code: 'specialmint',
        scope: 'specialmint',
        table: 'resources',
        lower_bound: chainAccount,
        limit: 1,
      });

      const contractRamDataByUser = res.rows;
      if (
        !contractRamDataByUser.length ||
        contractRamDataByUser[0].account !== chainAccount
      ) {
        throw new Error(`No initial storage found for ${chainAccount}.`);
      }

      return contractRamDataByUser[0].ram_bytes;
    } catch (err) {
      console.warn(err);
      return -1;
    }
  };

  getXPRtoXUSDCConversionRate = async (): Promise<number> => {
    try {
      const res = await this.rpc.get_table_rows({
        code: 'proton.swaps',
        scope: 'proton.swaps',
        table: 'pools',
        limit: -1,
      });

      const conversion = res.rows.filter(
        ({ lt_symbol }) => lt_symbol === '8,XPRUSDC'
      )[0];

      if (!conversion) {
        throw new Error('Conversion rate not found.');
      }

      const { pool1, pool2 } = conversion;
      const xpr = parseFloat(pool1.quantity.split(' ')[0]);
      const xusdc = parseFloat(pool2.quantity.split(' ')[0]);
      return (xusdc / xpr) * 1.1; // Multiplied by 1.1 to add a 10% buffer
    } catch (err) {
      console.warn(err);
      return 0;
    }
  };

  isAccountLightKYCVerified = async (
    chainAccount: string
  ): Promise<boolean> => {
    try {
      const verifiedAccounts = await this.rpc.isLightKYCVerified(chainAccount);

      if (verifiedAccounts.length < 1) {
        return false;
      }

      return verifiedAccounts[0].isLightKYCVerified;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  async getTeleportFees(): Promise<TeleportFees[]> {
    const { rows } = await this.rpc.get_table_rows({
      json: true,
      code: process.env.NEXT_PUBLIC_PRT_NFT_BRIDGE,
      scope: 0,
      table: 'fees',
    });

    return rows && rows.length
      ? rows.map(el => {
        const port_in_fee = Number(el.port_in_fee?.split(" ")[0]);
        const port_out_fee = Number(el.port_out_fee?.split(" ")[0]);
        return {
          chain_id: Number(el.chain_id),
          port_in_fee,
          port_out_fee
        };
      })
      : [];
  }

  async getFeesBalanceForTeleport(
    chainAccount: string
  ): Promise<TeleportFeesBalance> {
    const { rows } = await this.rpc.get_table_rows({
      json: true,
      code: process.env.NEXT_PUBLIC_PRT_NFT_BRIDGE,
      scope: 0,
      table: 'feesbalance',
      lower_bound: chainAccount,
      upper_bound: chainAccount,
      limit: 1,
    });

    return rows && rows.length && rows[0].owner === chainAccount
      ? {
        balance: Number(rows[0].balance?.split(" ")[0]),
        owner: rows[0].owner,
        reserved: Number(rows[0].reserved?.split(" ")[0]),
      } : {
        balance: 0,
        owner: chainAccount,
        reserved: 0
      };
  }

  async getOutReqsForTeleport(): Promise<TeleportOutReqs[]> {
    const { rows } = await this.rpc.get_table_rows({
      json: true,
      code: process.env.NEXT_PUBLIC_PRT_NFT_BRIDGE,
      scope: 0,
      table: 'outreqs',
    });

    return rows;
  }
}

const proton = new ProtonJs();
export default proton;
