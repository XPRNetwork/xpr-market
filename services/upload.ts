const uploadToIPFS = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const resultRaw = await fetch(
      `https://api.protonchain.com/v1/chain/files`,
      {
        method: 'POST',
        body: formData,
      }
    );
    const result = await resultRaw.json();

    if (result.error) {
      throw new Error(result.message);
    }
    if (result) {
      return result.IpfsHash;
    }
  } catch (e) {
    throw new Error(e);
  }
};

export default uploadToIPFS;
