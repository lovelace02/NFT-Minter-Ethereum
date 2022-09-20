import React, { useState, useRef, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";

import NFT from "../utils/abi/NFT.json";
import { INFTInfo } from "../types/INFTInfo";
import { filterNFTs } from "../utils/filterNFTs";
import { ListNFT } from "./ListNFT";
import { signMessage } from "../utils/signMessage";

export default function SignMessage() {
  const [nftList, setNFTList] = useState<INFTInfo[]>([]);
  const [messageTyped, setMessageTyped] = useState("");
  const [loading, setLoading] = useState(false);
  //function to be called when mint occurs
  const nftMinted = () => {
    fetchNFTs();
  };
  //Call the signMessage function after submitting the message.
  const handleSign = async (e: any) => {
    e.preventDefault();

    if (messageTyped)
      signMessage({
        event: nftMinted,
        message: messageTyped,
        setLoading: setLoading,
      });
  };
  //Fetch all minted NFTs from contract
  const fetchNFTs = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    let nftContract = new ethers.Contract(CONTRACT_ADDRESS, NFT.abi, signer);
    let allNFTs = await nftContract.fetchNFTs();
    const items = await filterNFTs(allNFTs);
    // So the new ones appear at the top
    setNFTList(items.reverse());
  };

  useEffect(() => {
    try {
      fetchNFTs();
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <>
      <form className="m-4 " onSubmit={handleSign}>
        <div className="credit-card w-6/12	 shadow-lg mx-auto rounded-xl bg-white">
          <main className="mt-4 p-4">
            <h1 className="text-xl font-semibold text-gray-700 text-center">
              Sign messages
            </h1>
            <div className="">
              <div className="my-3">
                <textarea
                  required
                  name="message"
                  className="textarea w-full h-24 textarea-bordered focus:ring focus:outline-none"
                  placeholder="Message"
                  onChange={(e) => setMessageTyped(e.target.value)}
                />
              </div>
            </div>
          </main>
          <footer className="p-4">
            <button
              type="submit"
              className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
            >
              Sign message
            </button>
          </footer>
        </div>
      </form>
      <ListNFT nftList={nftList} loading={loading} />
    </>
  );
}
