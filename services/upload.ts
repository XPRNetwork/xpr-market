import getConfig from 'next/config';
import { getFromApi } from '../utils/browser-fetch';

const {
  publicRuntimeConfig: { protonBackendServiceApi },
} = getConfig();

type CachedBased64Strings = {
  [ipfsHash: string]: string;
};

export type MetadataResult = {
  fileExtension?: string;
  ipfsHash?: string;
  nsfw?: { className: string; probability: number }[];
};

export const uploadToIPFS = async (
  file: File,
  isCollection = false
): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('isCollection', JSON.stringify(isCollection));

  try {
    const resultRaw = await fetch(`${protonBackendServiceApi}/market/files`, {
      method: 'POST',
      body: formData,
    });
    const result = await resultRaw.json();

    if (!result || result.error) {
      throw new Error(result.message || 'Unable to upload');
    }

    return result.IpfsHash;
  } catch (e) {
    throw new Error(e);
  }
};

export const getCachedFiles = async (
  ipfsHash: string
): Promise<CachedBased64Strings> => {
  try {
    const res = await getFromApi<CachedBased64Strings>(
      `/api/cached-files/${ipfsHash}`
    );

    if (!res.success) {
      throw new Error((res.message as unknown) as string);
    }

    return res.message;
  } catch (e) {
    return {};
  }
};

export const getCachedMetadataByHash = async (
  hash: string
): Promise<MetadataResult> => {
  try {
    const res = await getFromApi<CachedBased64Strings>(
      `/api/metadata?hash=${hash}`
    );

    if (!res.success) {
      throw new Error((res.message as unknown) as string);
    }
    return res.message;
  } catch (e) {
    throw new Error(e);
  }
};

export default uploadToIPFS;
