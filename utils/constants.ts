export const EMPTY_BALANCE = '0 FOOBAR';
export const TOKEN_SYMBOL = 'FOOBAR';
export const TOKEN_CONTRACT = 'xtokens';
export const TOKEN_PRECISION = 6;
export const SHORTENED_TOKEN_PRECISION = 2;
export const DEFAULT_COLLECTION = 'monsters';
export const PRICE_OF_RAM_IN_XPR = 0.0222;
export const PAGINATION_LIMIT = 12;
export const LG_FILE_UPLOAD_TYPES_TEXT =
  'PNG, GIF, JPG, WEBP, or MP4. Max 30 MB.';
export const SM_FILE_UPLOAD_TYPES_TEXT = 'PNG, GIF, JPG, or WEBP. Max 5 MB.';
export const LG_FILE_UPLOAD_TYPES = {
  'image/png': true,
  'image/jpg': true,
  'image/jpeg': true,
  'image/gif': true,
  'image/webp': true,
  'video/mp4': true,
  'audio/mpeg': false,
  'audio/mp3': false,
};
export const SM_FILE_UPLOAD_TYPES = {
  'image/png': true,
  'image/jpg': true,
  'image/jpeg': true,
  'image/gif': true,
  'image/webp': true,
};
export const LG_FILE_SIZE_UPLOAD_LIMIT = 30 * 1000000; // 30 MB
export const SM_FILE_SIZE_UPLOAD_LIMIT = 5 * 1000000; // 5 MB
export const IPFS_RESOLVER = 'https://cloudflare-ipfs.com/ipfs/';
export interface QueryParams {
  collection_name?: string;
  owner?: string;
  state?: string;
  sender?: string;
  seller?: string;
  asset_id?: string;
  template_id?: string;
  limit?: string | number;
  sort?: string;
  order?: string;
  page?: number;
  symbol?: string;
}
export const DEFAULT_SCHEMA = {
  series: 'uint16',
  name: 'string',
  desc: 'string',
  image: 'string',
  audio: 'string',
  video: 'string',
};
