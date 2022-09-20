import type { NextPage } from "next";

import React from "react";
import SignMessage from "../components/SignMessage";
import { useWallet } from "../hooks/useWallet";

const Home: NextPage = () => {
  const { currentAccount, connectWalletAction, disconnect } = useWallet();

  return (
    <div>
      <div className="w-full flex justify-center  mt-4">
        <button
          className="w-96 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
          onClick={currentAccount ? disconnect : connectWalletAction}
        >
          {currentAccount ? "Disconnect" : "Connect Wallet To Get Started"}
        </button>
      </div>
      {currentAccount && <SignMessage />}
    </div>
  );
};

export default Home;
