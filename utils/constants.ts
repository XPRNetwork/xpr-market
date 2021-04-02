export const EMPTY_BALANCE = '0 FOOBAR';
export const TOKEN_SYMBOL = 'FOOBAR';
export const TOKEN_CONTRACT = 'xtokens';
export const TOKEN_PRECISION = 6;
export const SHORTENED_TOKEN_PRECISION = 2;
export const DEFAULT_COLLECTION = 'monsters';
export const PAGINATION_LIMIT = 10;
export const FILE_UPLOAD_TYPES_TEXT =
  'PNG, GIF, JPG, WEBP, MP4, or MP3. Max 30 MB.';
export const FILE_UPLOAD_TYPES = {
  'image/png': true,
  'image/jpg': true,
  'image/jpeg': true,
  'image/gif': true,
  'image/webp': true,
  'video/mp4': true,
  'audio/mp3': true,
};
export const LG_FILE_SIZE_UPLOAD_LIMIT = 30 * 1000000; //30 MB

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
