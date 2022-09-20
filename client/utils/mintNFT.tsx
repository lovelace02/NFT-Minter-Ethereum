import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";

import NFT from "../utils/abi/NFT.json";

interface IMint {
  message: string;
  hashedMessage: Uint8Array;
  signature: string;
  event: () => void;
}

// function responsible for minting the nft
export const mintNFT = async (props: IMint) => {
  const { message, hashedMessage, signature, event } = props;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  let nftContract = new ethers.Contract(CONTRACT_ADDRESS, NFT.abi, signer);
  // listen to NFTMinted event and update the nftList
  nftContract.on("NFTMinted", event);
  let txn = await nftContract.mintNFT(message, hashedMessage, signature);
  await txn.wait();

  return false;
};
