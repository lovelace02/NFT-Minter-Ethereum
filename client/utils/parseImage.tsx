//function to treat base64 string that come from contract
export const parseImage = (nft: string) => {
  console.log(nft);
  const value = JSON.parse(
    Buffer.from(nft.split("base64,")[1], "base64").toString()
  );
  return value.image;
};
