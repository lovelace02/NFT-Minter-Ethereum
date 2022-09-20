import { INFTInfo } from "../types/INFTInfo";

// function responsible for clearing the nft list that came from the contract
export const filterNFTs = async (allNFTs: INFTInfo[]) => {
  const itemsFiltered = allNFTs.filter((i: any) => i.tokenUri.length > 5);

  const items = await Promise.all(
    itemsFiltered.map(async (i: INFTInfo) => {
      let item = {
        owner: i.owner,
        tokenUri: i.tokenUri,
      };

      return item;
    })
  );
  return items;
};
