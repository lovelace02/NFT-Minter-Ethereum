import React from "react";
import { INFTInfo } from "../types/INFTInfo";
import { parseImage } from "../utils/parseImage";
import styles from "./ListNFT.module.css";

//shows the loading indicator and all NFTs from the nftList
export const ListNFT = (props: { nftList: INFTInfo[]; loading: boolean }) => {
  const { nftList, loading } = props;

  return (
    <div className="w-full p-8 flex flex-col	 items-center justify-center 	  ">
      <div>
        {loading && (
          <>
            <div className="flex items-center justify-center ">
              <div className="w-16 h-16 border-b-2 border-gray-900 rounded-full animate-spin"></div>
            </div>
          </>
        )}

        {nftList.map((nft: INFTInfo) => (
          <div className={styles.fadeIn}>
            <div
              className={
                "textarea w-full h-full textarea-bordered border-b-2 border-dashed p-4"
              }
            >
              <h1 className="text-teal-500 mb-8">Owner: {nft.owner}</h1>

              <div className="flex justify-center">
                <img className="w-96 h-96  " src={parseImage(nft.tokenUri)} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
