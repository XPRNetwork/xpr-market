const uploadToIPFS = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const resultRaw = await fetch(
      'https://nft.protonchain.com/api/upload',
      {
        method: 'POST',
        headers: {
          Authorization: `Basic 617782dd-7b0a-42c2-ac93-3bba2c569dfd`,
        },
        body: formData,
      }
    );
    const result = await resultRaw.json();
    if (result.success) {
      return result.message.IpfsHash;
    }
  } catch (e) {
    throw new Error(e);
  }
};

export default uploadToIPFS;
